// src/pages/admin/Categories/CategoryTreeItem.jsx
import React, { useState } from 'react';
import { FaChevronRight, FaChevronDown, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getIconEmoji, toFullUrl } from './styles';

/**
 * Tek bir kategori öğesi - Recursive yapıda
 */
const CategoryTreeItem = ({ 
  category, 
  level = 0, 
  expandedCategories, 
  toggleExpand, 
  openCreateModal, 
  openEditModal, 
  confirmDelete,
  styles,
  isMobile = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const isExpanded = expandedCategories[category.id];
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <div 
        style={styles.categoryItem(level, isHovered, isMobile)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={() => toggleExpand(category.id)}
          style={styles.expandButton(hasChildren)}
        >
          {hasChildren && (isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />)}
        </button>

        {/* Icon or Image */}
        <span style={styles.categoryIcon}>
          {category.image ? (
            <img 
              src={toFullUrl(category.image)} 
              alt={category.name}
              style={styles.categoryImage}
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }}
            />
          ) : null}
          <span style={{ display: category.image ? 'none' : 'inline' }}>
            {getIconEmoji(category.icon)}
          </span>
        </span>

        {/* Name & Info */}
        <div style={{ 
          flex: 1, 
          minWidth: isMobile ? '100%' : 'auto',
          order: isMobile ? -1 : 0,
          marginLeft: isMobile ? '32px' : 0
        }}>
          <div style={styles.categoryName(level, isMobile)}>
            {category.name}
          </div>
          <div style={styles.categoryMeta}>
            {category.direct_products_count || 0} ürün
            {hasChildren && ` • ${category.children.length} alt kategori`}
          </div>
        </div>

        {/* Status Badge */}
        <span style={styles.statusBadge(category.is_active, isMobile)}>
          {category.is_active ? 'Aktif' : 'Pasif'}
        </span>

        {/* Actions */}
        <div style={{ 
          display: 'flex', 
          gap: isMobile ? '6px' : '8px',
          flexWrap: 'nowrap',
          marginLeft: isMobile ? 'auto' : 0
        }}>
          <button
            onClick={() => openCreateModal(category.id)}
            title="Alt kategori ekle"
            style={styles.actionButton('add', isMobile)}
          >
            <FaPlus size={isMobile ? 12 : 10} /> {isMobile ? '' : 'Alt'}
          </button>
          <button
            onClick={() => openEditModal(category)}
            title="Düzenle"
            style={styles.actionButton('edit', isMobile)}
          >
            <FaEdit size={isMobile ? 16 : 14} />
          </button>
          <button
            onClick={() => confirmDelete(category)}
            title="Sil"
            style={styles.actionButton('delete', isMobile)}
          >
            <FaTrash size={isMobile ? 16 : 14} />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {category.children.map(child => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              expandedCategories={expandedCategories}
              toggleExpand={toggleExpand}
              openCreateModal={openCreateModal}
              openEditModal={openEditModal}
              confirmDelete={confirmDelete}
              styles={styles}
              isMobile={isMobile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryTreeItem;
