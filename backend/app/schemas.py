from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# Auth Schemas
class UserLogin(BaseModel):
    username: str
    password: str

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[dict] = None

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    id: int
    username: str
    email: str
    role: str
    created_at: datetime

# Hero Schema
class HeroBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    background_type: Optional[str] = "gradient"
    background_value: Optional[str] = None
    social_links: Optional[str] = None
    visible: int = 1
    order_index: int = 0

class HeroCreate(HeroBase):
    pass

class HeroUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    background_type: Optional[str] = None
    background_value: Optional[str] = None
    social_links: Optional[str] = None
    visible: Optional[int] = None
    order_index: Optional[int] = None

class Hero(HeroBase):
    id: int
    created_at: datetime
    updated_at: datetime

# About Schema
class AboutBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    location: Optional[str] = None
    stats: Optional[str] = None
    visible: int = 1
    order_index: int = 1

class AboutCreate(AboutBase):
    pass

class AboutUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    location: Optional[str] = None
    stats: Optional[str] = None
    visible: Optional[int] = None
    order_index: Optional[int] = None

class About(AboutBase):
    id: int
    created_at: datetime
    updated_at: datetime

# Skill Schema
class SkillBase(BaseModel):
    category: str
    name: str
    level: int = 0
    icon: Optional[str] = None
    order_index: int = 0
    visible: int = 1

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    category: Optional[str] = None
    name: Optional[str] = None
    level: Optional[int] = None
    icon: Optional[str] = None
    order_index: Optional[int] = None
    visible: Optional[int] = None

class Skill(SkillBase):
    id: int
    created_at: datetime
    updated_at: datetime

# Project Schema
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    long_description: Optional[str] = None
    image_url: Optional[str] = None
    tags: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    featured: int = 0
    visible: int = 1
    order_index: int = 0

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    long_description: Optional[str] = None
    image_url: Optional[str] = None
    tags: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    featured: Optional[int] = None
    visible: Optional[int] = None
    order_index: Optional[int] = None

class Project(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

# Experience Schema
class ExperienceBase(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    current: int = 0
    description: Optional[str] = None
    technologies: Optional[str] = None
    visible: int = 1
    order_index: int = 0

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    current: Optional[int] = None
    description: Optional[str] = None
    technologies: Optional[str] = None
    visible: Optional[int] = None
    order_index: Optional[int] = None

class Experience(ExperienceBase):
    id: int
    created_at: datetime
    updated_at: datetime

# Education Schema
class EducationBase(BaseModel):
    degree: str
    institution: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    grade: Optional[str] = None
    visible: int = 1
    order_index: int = 0

class EducationCreate(EducationBase):
    pass

class EducationUpdate(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    grade: Optional[str] = None
    visible: Optional[int] = None
    order_index: Optional[int] = None

class Education(EducationBase):
    id: int
    created_at: datetime
    updated_at: datetime

# Blog Schema
class BlogBase(BaseModel):
    title: str
    slug: str
    content: Optional[str] = None
    excerpt: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    status: str = "draft"
    featured: int = 0

class BlogCreate(BlogBase):
    pass

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    status: Optional[str] = None
    featured: Optional[int] = None

class Blog(BlogBase):
    id: int
    views: int
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

# Testimonial Schema
class TestimonialBase(BaseModel):
    name: str
    role: Optional[str] = None
    company: Optional[str] = None
    content: str
    image_url: Optional[str] = None
    rating: int = 5
    visible: int = 1
    order_index: int = 0

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    company: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    rating: Optional[int] = None
    visible: Optional[int] = None
    order_index: Optional[int] = None

class Testimonial(TestimonialBase):
    id: int
    created_at: datetime
    updated_at: datetime

# Service Schema
class ServiceBase(BaseModel):
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    features: Optional[str] = None
    visible: int = 1
    order_index: int = 0

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    features: Optional[str] = None
    visible: Optional[int] = None
    order_index: Optional[int] = None

class Service(ServiceBase):
    id: int
    created_at: datetime
    updated_at: datetime

# Contact Schema
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str

# SEO Schema
class SEOPageBase(BaseModel):
    page_name: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    twitter_card: str = "summary_large_image"
    twitter_title: Optional[str] = None
    twitter_description: Optional[str] = None
    twitter_image: Optional[str] = None
    canonical_url: Optional[str] = None
    schema_markup: Optional[str] = None

class SEOPageCreate(SEOPageBase):
    pass

class SEOPageUpdate(BaseModel):
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    twitter_card: Optional[str] = None
    twitter_title: Optional[str] = None
    twitter_description: Optional[str] = None
    twitter_image: Optional[str] = None
    canonical_url: Optional[str] = None
    schema_markup: Optional[str] = None

class SEOPage(SEOPageBase):
    id: int
    created_at: datetime
    updated_at: datetime

# Theme Schema
class ThemeSettings(BaseModel):
    primary_color: str = "#3b82f6"
    secondary_color: str = "#8b5cf6"
    accent_color: str = "#10b981"
    font_primary: str = "Inter"
    font_secondary: str = "Poppins"
    font_code: str = "Fira Code"
    dark_mode: int = 1
    custom_css: Optional[str] = None
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None

# Settings Schema
class SiteSettings(BaseModel):
    site_name: str = "My Portfolio"
    site_description: Optional[str] = None
    site_url: Optional[str] = None
    contact_email: Optional[str] = None
    smtp_host: Optional[str] = None
    smtp_port: Optional[int] = None
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None
    robots_txt: Optional[str] = None
    google_analytics: Optional[str] = None
