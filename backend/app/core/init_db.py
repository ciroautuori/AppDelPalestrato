from sqlalchemy.orm import Session
from app.core.database import Base, engine
from app.models.user import User, UserRole
from app.core.security import get_password_hash
from app.core.config import settings


def init_db(db: Session) -> None:
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Create superuser if it doesn't exist
    superuser = db.query(User).filter(
        User.email == settings.SUPERUSER_EMAIL).first()
    if not superuser:
        superuser = User(
            email=settings.SUPERUSER_EMAIL,
            hashed_password=get_password_hash(settings.SUPERUSER_PASSWORD),
            role=UserRole.ADMIN,
            is_active=True
        )
        db.add(superuser)
        db.commit()
        db.refresh(superuser)
