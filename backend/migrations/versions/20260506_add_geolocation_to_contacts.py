"""add geolocation fields to contacts

Revision ID: 20260506_add_geolocation_to_contacts
Revises: 20260227_add_kind_to_contacts
Create Date: 2026-05-06

"""

from alembic import op
import sqlalchemy as sa


revision = "20260506_add_geolocation_to_contacts"
down_revision = "20260227_add_kind_to_contacts"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "contacts",
        sa.Column("latitude", sa.Numeric(precision=10, scale=8), nullable=True),
    )
    op.add_column(
        "contacts",
        sa.Column("longitude", sa.Numeric(precision=11, scale=8), nullable=True),
    )


def downgrade():
    op.drop_column("contacts", "longitude")
    op.drop_column("contacts", "latitude")
