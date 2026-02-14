"""Initial schema for swipall_pos

Revision ID: 2774dea07b3b
Revises: 
Create Date: 2026-02-07 12:37:30.905206

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2774dea07b3b'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'contacts',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.Column('address', sa.Text(), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'taxonomies',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=True),
        sa.Column('value', sa.Text(), nullable=True),
        sa.Column('slug', sa.String(length=255), nullable=True),
        sa.Column('kind', sa.String(length=50), nullable=True),
        sa.Column('ordering', sa.Integer(), nullable=True),
        sa.Column('icon', sa.String(length=255), nullable=True),
        sa.Column('color', sa.String(length=50), nullable=True),
        sa.Column('image', sa.String(length=255), nullable=True),
        sa.Column('parent_id', sa.String(length=36), nullable=True),
        sa.ForeignKeyConstraint(['parent_id'], ['taxonomies.id'], name='fk_taxonomies_parent'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'products',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=True),
        sa.Column('sku', sa.String(length=100), nullable=True),
        sa.Column('price', sa.Numeric(precision=18, scale=4), nullable=True),
        sa.Column('cost', sa.Numeric(precision=18, scale=4), nullable=True),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column('tax_rate', sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column('taxonomy_id', sa.String(length=36), nullable=True),
        sa.Column('attribute_combinations', sa.Text(), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), nullable=True),
        sa.ForeignKeyConstraint(['taxonomy_id'], ['taxonomies.id'], name='fk_products_taxonomy'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'product_taxonomies',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('product_id', sa.String(length=36), nullable=True),
        sa.Column('taxonomy_id', sa.String(length=36), nullable=True),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], name='fk_prod_tax_product'),
        sa.ForeignKeyConstraint(['taxonomy_id'], ['taxonomies.id'], name='fk_prod_tax_taxonomy'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'warehouses',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=True),
        sa.Column('location', sa.Text(), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'inventories',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('warehouse_id', sa.String(length=36), nullable=True),
        sa.Column('product_id', sa.String(length=36), nullable=True),
        sa.Column('quantity', sa.Numeric(precision=18, scale=4), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), nullable=True),
        sa.ForeignKeyConstraint(['warehouse_id'], ['warehouses.id'], name='fk_inventories_warehouse'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], name='fk_inventories_product'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'orders',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('contact_id', sa.String(length=36), nullable=True),
        sa.Column('total', sa.Numeric(precision=18, scale=4), nullable=True),
        sa.Column('subtotal', sa.Numeric(precision=18, scale=4), nullable=True),
        sa.Column('tax', sa.Numeric(precision=18, scale=4), nullable=True),
        sa.Column('discount', sa.Numeric(precision=18, scale=4), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True),
        sa.Column('payment_status', sa.String(length=50), nullable=True),
        sa.Column('payment_method', sa.String(length=50), nullable=True),
        sa.Column('type', sa.String(length=50), nullable=True),
        sa.Column('extra_fields', sa.Text(), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), nullable=True),
        sa.ForeignKeyConstraint(['contact_id'], ['contacts.id'], name='fk_orders_contact'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'order_items',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('order_id', sa.String(length=36), nullable=True),
        sa.Column('product_id', sa.String(length=36), nullable=True),
        sa.Column('quantity', sa.Integer(), nullable=True),
        sa.Column('price', sa.Numeric(precision=18, scale=4), nullable=True),
        sa.Column('total', sa.Numeric(precision=18, scale=4), nullable=True),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], name='fk_order_items_order'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], name='fk_order_items_product'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'bill_accounts',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=True),
        sa.Column('type', sa.String(length=50), nullable=True),
        sa.Column('balance', sa.Numeric(precision=18, scale=4), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'order_bill_accounts',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('order_id', sa.String(length=36), nullable=True),
        sa.Column('bill_account_id', sa.String(length=36), nullable=True),
        sa.Column('amount', sa.Numeric(precision=18, scale=4), nullable=True),
        sa.Column('movement_type', sa.String(length=20), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], name='fk_order_ba_order'),
        sa.ForeignKeyConstraint(['bill_account_id'], ['bill_accounts.id'], name='fk_order_ba_bill'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'product_components',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('parent_product_id', sa.String(length=36), nullable=True),
        sa.Column('component_product_id', sa.String(length=36), nullable=True),
        sa.Column('quantity', sa.Numeric(precision=18, scale=4), nullable=True),
        sa.ForeignKeyConstraint(['parent_product_id'], ['products.id'], name='fk_pc_parent'),
        sa.ForeignKeyConstraint(['component_product_id'], ['products.id'], name='fk_pc_component'),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('product_components')
    op.drop_table('order_bill_accounts')
    op.drop_table('bill_accounts')
    op.drop_table('order_items')
    op.drop_table('orders')
    op.drop_table('inventories')
    op.drop_table('warehouses')
    op.drop_table('product_taxonomies')
    op.drop_table('products')
    op.drop_table('taxonomies')
    op.drop_table('contacts')
