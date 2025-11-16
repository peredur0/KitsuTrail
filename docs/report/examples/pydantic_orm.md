## Pydantic & ORM
```python
from pydantic import BaseModel
class CurrentState(BaseModel):
    active_sessions: int = 0
    active_users: int = 0
    total_users: int = 0
    total_idp: int = 0
    total_sp: int = 0


from pydantic import EmailStr
from sqlmodel import SQLModel, Field

class UserBase(SQLModel):
    login: str = Field(unique=True, index=True)
    firstname: str | None = Field(default=None, index=True)
    lastname: str | None = Field(default=None, index=True)
    email: EmailStr | None = Field(default=None, index=True)

class UserInDB(UserBase, table=True):
    __tablename__ = "users"
    id: str = Field(primary_key=True)
    created_at: datetime.datetime = Field()


from sqlmodel import Session, select, func
def get_current_state(session: Session_dep):
    total_users = session.exec(select(func.count()).select_from(UserInDB)).one()
    total_idp = session.exec(
        select(func.count()).select_from(Provider).where(Provider.type == 'idp')
    ).one()
    total_sp = session.exec(
        select(func.count()).select_from(Provider).where(Provider.type == 'sp')
    ).one()

    delta = datetime.timedelta(minutes=20)
    time_limit = datetime.datetime.now(datetime.timezone.utc) - delta
    active_user_stmt = (
        select(func.count(func.distinct(AuditLog.user_id))).where(
            AuditLog.timestamp >= time_limit,
            AuditLog.action == 'access',
            AuditLog.result == 'success'
        )
    )
    active_users = session.exec(active_user_stmt).one()

    active_sessions_stmt = (
        select(func.count(func.distinct(AuditLog.trace_id))).where(
            AuditLog.timestamp >= time_limit,
            AuditLog.action == 'authentication',
            AuditLog.result == 'success'
        )
    )
    active_sessions = session.exec(active_sessions_stmt).one()

    return CurrentState(
        active_sessions=active_sessions,
        active_users=active_users,
        total_users=total_users,
        total_idp=total_idp,
        total_sp=total_sp
    )
```
