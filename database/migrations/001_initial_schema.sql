-- Initial Schema for NepTechNews

-- users ------------------------------------------------------------
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash CHAR(60) NOT NULL,
    role ENUM('super_admin','chief_editor','category_editor','journalist','translator','fact_checker','reader') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- categories --------------------------------------------------------
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name_en VARCHAR(100) NOT NULL,
    name_np VARCHAR(100) NOT NULL,
    parent_id BIGINT UNSIGNED NULL,
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB;

-- stories (Editorial Entity) ---------------------------------------
CREATE TABLE stories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canonical_story_id BIGINT UNSIGNED NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    content_type ENUM('news','breaking_news','analysis','investigation','opinion','editorial','interview','explainer','feature','photo_story','video_story','live_blog','press_release','sponsored_content','correction_update') NOT NULL DEFAULT 'news',
    status ENUM('ingested','ai_processing','draft','fact_check','editor_review','approved','scheduled','published','updated','archived') NOT NULL DEFAULT 'draft',
    published_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_published (published_at)
) ENGINE=InnoDB;

-- story_translations (Language-specific representation) -------------
CREATE TABLE story_translations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    story_id BIGINT UNSIGNED NOT NULL,
    language ENUM('en', 'np') NOT NULL,
    title TEXT NOT NULL,
    slug VARCHAR(255) NOT NULL,
    deck TEXT,
    body LONGTEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    focus_keyword VARCHAR(255),
    excerpt TEXT,
    translation_status ENUM('draft', 'review', 'approved') DEFAULT 'draft',
    translated_by BIGINT UNSIGNED NULL,
    reviewed_by BIGINT UNSIGNED NULL,
    reviewed_at DATETIME NULL,
    UNIQUE INDEX idx_story_lang (story_id, language),
    INDEX idx_slug (slug)
) ENGINE=InnoDB;

-- media ------------------------------------------------------------
CREATE TABLE media (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uploader_id BIGINT UNSIGNED NOT NULL,
    filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT UNSIGNED NOT NULL,
    width INT UNSIGNED NULL,
    height INT UNSIGNED NULL,
    format ENUM('webp','avif','jpeg','png') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_uploader (uploader_id),
    INDEX idx_format (format)
) ENGINE=InnoDB;
