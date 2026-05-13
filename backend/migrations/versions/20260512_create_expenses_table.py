"""create expenses table

Revision ID: 20260512_create_expenses_table
Revises: 20260506_add_geolocation_to_contacts
Create Date: 2026-05-12

"""

from alembic import op
import sqlalchemy as sa


revision = "20260512_create_expenses_table"
down_revision = "20260506_add_geolocation_to_contacts"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "expenses",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("amount", sa.Numeric(precision=18, scale=4), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="success"),
        sa.Column("note", sa.Text, nullable=True),
        sa.Column("latitude", sa.Numeric(precision=10, scale=8), nullable=True),
        sa.Column("longitude", sa.Numeric(precision=11, scale=8), nullable=True),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.current_timestamp()),
        sa.Column(
            "updated_at",
            sa.DateTime,
            server_default=sa.func.current_timestamp(),
            onupdate=sa.func.current_timestamp(),
        ),
    )


def downgrade():
    op.drop_table("expenses")
