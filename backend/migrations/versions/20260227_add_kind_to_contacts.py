"""add kind field to contacts

Revision ID: 20260227_add_kind_to_contacts
Revises: 
Create Date: 2026-02-27
"""

from alembic import op
import sqlalchemy as sa


revision = "20260227_add_kind_to_contacts"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "contacts",
        sa.Column("kind", sa.String(length=20), nullable=True, server_default="customer"),
    )
    op.execute("UPDATE contacts SET kind = 'customer' WHERE kind IS NULL")
    op.alter_column("contacts", "kind", existing_type=sa.String(length=20), nullable=False)
    op.create_check_constraint(
        "ck_contacts_kind",
        "contacts",
        "kind IN ('customer', 'supplier')",
    )


def downgrade():
    op.drop_constraint("ck_contacts_kind", "contacts", type_="check")
    op.drop_column("contacts", "kind")
