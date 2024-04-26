from pydantic import BaseModel


class MovieBase(BaseModel):
    name: str
    year: int
    runtime: int
    filepath: str


class MovieCreate(MovieBase):
    pass


class MovieUpdate(MovieBase):
    pass


class Movie(MovieBase):
    id: int

    class Config:
        orm_mode = True
