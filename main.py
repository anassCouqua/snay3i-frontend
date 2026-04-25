from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from pydantic import BaseModel
from typing import Optional
import json

DATABASE_URL = "sqlite:///./servicenow.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

class Worker(Base):
    __tablename__ = "workers"
    id       = Column(Integer, primary_key=True, index=True)
    name     = Column(String, nullable=False)
    service  = Column(String, nullable=False, index=True)
    city     = Column(String, nullable=False)
    rating   = Column(Float, default=5.0)
    reviews  = Column(Integer, default=0)
    price    = Column(String, default="150 MAD/h")
    verified = Column(Boolean, default=False)
    bio      = Column(String, default="")
    tags     = Column(String, default="[]")

Base.metadata.create_all(bind=engine)

class WorkerOut(BaseModel):
    id: int
    name: str
    service: str
    city: str
    rating: float
    reviews: int
    price: str
    verified: bool
    bio: str
    tags: list[str]
    model_config = {"from_attributes": True}

class WorkerCreate(BaseModel):
    name: str
    service: str
    city: str
    rating: float = 5.0
    reviews: int = 0
    price: str = "150 MAD/h"
    verified: bool = False
    bio: str = ""
    tags: list[str] = []

app = FastAPI(title="ServiceNow Maroc API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

SEED_WORKERS = [
    {"name": "Hassan Benali",   "service": "plumber",     "city": "Casablanca", "rating": 4.8, "reviews": 124, "price": "150 MAD/h", "verified": True,  "bio": "10 ans d'experience en plomberie residentielle et commerciale.",         "tags": ["Urgences", "Chauffe-eau", "Sanitaires"]},
    {"name": "Fouad Mimouni",   "service": "plumber",     "city": "Marrakech",  "rating": 4.7, "reviews": 77,  "price": "130 MAD/h", "verified": True,  "bio": "Plombier urgentiste 24h/24. Fuites, debouchage, chauffe-eau.",           "tags": ["24h/24", "Urgences", "Debouchage"]},
    {"name": "Youssef Alami",   "service": "electrician", "city": "Rabat",      "rating": 4.9, "reviews": 89,  "price": "180 MAD/h", "verified": True,  "bio": "Electricien certifie. Installations, depannages, tableaux electriques.", "tags": ["Cablage", "Domotique", "Securite"]},
    {"name": "Amine Bensouda",  "service": "electrician", "city": "Agadir",     "rating": 4.5, "reviews": 44,  "price": "160 MAD/h", "verified": False, "bio": "Electricien residentiel. Pannes, installations, climatisation.",         "tags": ["Clim", "Pannes", "Installation"]},
    {"name": "Karim Tazi",      "service": "builder",     "city": "Marrakech",  "rating": 4.7, "reviews": 211, "price": "200 MAD/h", "verified": True,  "bio": "Maconnerie traditionnelle et moderne. Renovation complete.",            "tags": ["Renovation", "Zellige", "Tadelakt"]},
    {"name": "Omar Fassi",      "service": "handyman",    "city": "Fes",        "rating": 4.6, "reviews": 67,  "price": "120 MAD/h", "verified": False, "bio": "Bricoleur polyvalent. Montage meubles, petites reparations.",            "tags": ["Montage", "Reparation", "Jardinage"]},
    {"name": "Rachid Idrissi",  "service": "painter",     "city": "Casablanca", "rating": 4.9, "reviews": 153, "price": "140 MAD/h", "verified": True,  "bio": "Peintre decorateur. Interieur et exterieur. Tadelakt specialiste.",     "tags": ["Interieur", "Exterieur", "Deco"]},
    {"name": "Mehdi Cherkaoui", "service": "carpenter",   "city": "Tanger",     "rating": 4.8, "reviews": 98,  "price": "170 MAD/h", "verified": True,  "bio": "Menuisier artisan. Cuisine sur mesure, portes, fenetres.",              "tags": ["Sur mesure", "Cuisine", "Fenetres"]},
]

def seed_db():
    db = SessionLocal()
    try:
        if db.query(Worker).count() == 0:
            for w in SEED_WORKERS:
                worker = Worker(**{**w, "tags": json.dumps(w["tags"])})
                db.add(worker)
            db.commit()
            print("Database seeded with sample workers.")
    finally:
        db.close()

seed_db()

def serialize(worker: Worker) -> WorkerOut:
    return WorkerOut(
        id=worker.id,
        name=worker.name,
        service=worker.service,
        city=worker.city,
        rating=worker.rating,
        reviews=worker.reviews,
        price=worker.price,
        verified=worker.verified,
        bio=worker.bio,
        tags=json.loads(worker.tags) if worker.tags else [],
    )

@app.get("/")
def root():
    return {"message": "ServiceNow Maroc API is running", "docs": "/docs"}

@app.get("/workers", response_model=list[WorkerOut])
def get_all_workers(city: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Worker)
    if city:
        query = query.filter(Worker.city.ilike(city))
    return [serialize(w) for w in query.all()]

@app.get("/workers/{service}", response_model=list[WorkerOut])
def get_workers_by_service(service: str, city: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Worker).filter(Worker.service.ilike(service))
    if city:
        query = query.filter(Worker.city.ilike(city))
    workers = query.all()
    if not workers:
        raise HTTPException(status_code=404, detail=f"No workers found for service: {service}")
    return [serialize(w) for w in workers]

@app.post("/workers", response_model=WorkerOut, status_code=201)
def create_worker(data: WorkerCreate, db: Session = Depends(get_db)):
    worker = Worker(**{**data.model_dump(), "tags": json.dumps(data.tags)})
    db.add(worker)
    db.commit()
    db.refresh(worker)
    return serialize(worker)

@app.delete("/workers/{worker_id}", status_code=204)
def delete_worker(worker_id: int, db: Session = Depends(get_db)):
    worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    db.delete(worker)
    db.commit()
