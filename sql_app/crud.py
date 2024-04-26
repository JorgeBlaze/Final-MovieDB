from sqlalchemy.orm import Session

from . import models, schemas


def get_movie(db: Session, movie_id: int):
    return db.query(models.Movie).filter(models.Movie.id == movie_id).first()


def get_movies_by_name(db: Session, name: str):
    return db.query(models.Movie).filter(models.Movie.name.ilike(f"%{name}%")).all()



def get_movies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Movie).offset(skip).limit(limit).all()


def create_movie(db: Session, movie: schemas.MovieCreate):
    db_movie = models.Movie(**movie.dict())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie


def update_movie(db: Session, movie: schemas.MovieUpdate, movie_id: int):
    db_movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    for key, value in movie.dict().items():
        setattr(db_movie, key, value)
    db.commit()
    db.refresh(db_movie)
    return db_movie


def delete_movie(db: Session, movie_id: int):
    db_movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    db.delete(db_movie)
    db.commit()
    return {"message": "Movie deleted"}
