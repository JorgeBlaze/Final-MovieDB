from fastapi import Depends, FastAPI, HTTPException, File, UploadFile, APIRouter
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os


from . import crud, models, schemas, utils
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


router = APIRouter()


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins; replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/movies/search/", response_model=list[schemas.Movie])
def search_movies(term: str, db: Session = Depends(get_db)):
    movies = crud.get_movies_by_name(db, term)
    if not movies:
        raise HTTPException(status_code=404, detail="Movies not found")
    return movies



@app.post("/movies/", response_model=schemas.Movie)
def create_movie(movie: schemas.MovieCreate, db: Session = Depends(get_db)):
    db_movie = crud.get_movie_by_name(db, name=movie.name)
    if db_movie:
        raise HTTPException(status_code=400, detail="Movie already exists")
    return crud.create_movie(db=db, movie=movie)


@app.get("/movies/", response_model=list[schemas.Movie])
def read_movies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    movies = crud.get_movies(db, skip=skip, limit=limit)
    return movies


@app.get("/movies/{movie_id}", response_model=schemas.Movie)
def read_movie(movie_id: int, db: Session = Depends(get_db)):
    db_movie = crud.get_movie(db, movie_id=movie_id)
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return db_movie


@app.put("/movies/{movie_id}", response_model=schemas.Movie)
def update_movie(movie_id: int, movie: schemas.MovieUpdate, db: Session = Depends(get_db)):
    db_movie = crud.get_movie(db, movie_id=movie_id)
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return crud.update_movie(db=db, movie=movie, movie_id=movie_id)


@app.delete("/movies/{movie_id}")
def delete_movie(movie_id: int, db: Session = Depends(get_db)):
    db_movie = crud.get_movie(db, movie_id=movie_id)
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    crud.delete_movie(db=db, movie_id=movie_id)
    return {"message": "Movie deleted"}


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        with open(f"uploads/{file.filename}", "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        filepath = os.path.join("uploads", file.filename)
        
        # Extract movie details using some method (you can use ffmpeg or other libraries)
        name, year, runtime = extract_movie_details(filepath)

        movie_data = {
            "name": name,
            "year": year,
            "runtime": runtime,
            "filepath": filepath
        }

        return movie_data

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
