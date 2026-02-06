from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from app.schemas import (
    HeroCreate, HeroUpdate, Hero,
    AboutCreate, AboutUpdate, About,
    SkillCreate, SkillUpdate, Skill,
    ProjectCreate, ProjectUpdate, Project,
    ExperienceCreate, ExperienceUpdate, Experience,
    EducationCreate, EducationUpdate, Education,
    TestimonialCreate, TestimonialUpdate, Testimonial,
    ServiceCreate, ServiceUpdate, Service,
    ContactMessage
)
from app.database import get_db
from app.routers.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api", tags=["Content"])

# Hero Endpoints
@router.get("/hero", response_model=List[Hero])
async def get_hero():
    """Get all hero sections"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM hero ORDER BY order_index")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

@router.get("/hero/{hero_id}", response_model=Hero)
async def get_hero_by_id(hero_id: int):
    """Get hero by ID"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM hero WHERE id = ?", (hero_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Hero not found")
        return dict(row)

@router.post("/hero", response_model=Hero, status_code=status.HTTP_201_CREATED)
async def create_hero(hero: HeroCreate, current_user: dict = Depends(get_current_user)):
    """Create new hero section"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO hero (title, subtitle, description, cta_text, cta_link, 
                            background_type, background_value, social_links, visible, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (hero.title, hero.subtitle, hero.description, hero.cta_text, hero.cta_link,
              hero.background_type, hero.background_value, hero.social_links, hero.visible, hero.order_index))
        
        hero_id = cursor.lastrowid
        conn.commit()
        
        cursor.execute("SELECT * FROM hero WHERE id = ?", (hero_id,))
        return dict(cursor.fetchone())

@router.put("/hero/{hero_id}", response_model=Hero)
async def update_hero(hero_id: int, hero: HeroUpdate, current_user: dict = Depends(get_current_user)):
    """Update hero section"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Get existing hero
        cursor.execute("SELECT * FROM hero WHERE id = ?", (hero_id,))
        existing = cursor.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Hero not found")
        
        # Build update query
        updates = []
        values = []
        for field, value in hero.dict(exclude_unset=True).items():
            updates.append(f"{field} = ?")
            values.append(value)
        
        if updates:
            values.append(hero_id)
            query = f"UPDATE hero SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
            cursor.execute(query, values)
            conn.commit()
        
        cursor.execute("SELECT * FROM hero WHERE id = ?", (hero_id,))
        return dict(cursor.fetchone())

@router.delete("/hero/{hero_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_hero(hero_id: int, current_user: dict = Depends(get_current_user)):
    """Delete hero section"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM hero WHERE id = ?", (hero_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Hero not found")
        conn.commit()

# About Endpoints
@router.get("/about", response_model=List[About])
async def get_about():
    """Get all about sections"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM about ORDER BY order_index")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

@router.post("/about", response_model=About, status_code=status.HTTP_201_CREATED)
async def create_about(about: AboutCreate, current_user: dict = Depends(get_current_user)):
    """Create about section"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO about (title, description, image_url, location, stats, visible, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (about.title, about.description, about.image_url, about.location, about.stats, about.visible, about.order_index))
        
        about_id = cursor.lastrowid
        conn.commit()
        
        cursor.execute("SELECT * FROM about WHERE id = ?", (about_id,))
        return dict(cursor.fetchone())

@router.put("/about/{about_id}", response_model=About)
async def update_about(about_id: int, about: AboutUpdate, current_user: dict = Depends(get_current_user)):
    """Update about section"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM about WHERE id = ?", (about_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="About not found")
        
        updates = []
        values = []
        for field, value in about.dict(exclude_unset=True).items():
            updates.append(f"{field} = ?")
            values.append(value)
        
        if updates:
            values.append(about_id)
            query = f"UPDATE about SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
            cursor.execute(query, values)
            conn.commit()
        
        cursor.execute("SELECT * FROM about WHERE id = ?", (about_id,))
        return dict(cursor.fetchone())

@router.delete("/about/{about_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_about(about_id: int, current_user: dict = Depends(get_current_user)):
    """Delete about section"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM about WHERE id = ?", (about_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="About not found")
        conn.commit()

# Skills Endpoints
@router.get("/skills", response_model=List[Skill])
async def get_skills(category: Optional[str] = None):
    """Get all skills, optionally filtered by category"""
    with get_db() as conn:
        cursor = conn.cursor()
        if category:
            cursor.execute("SELECT * FROM skills WHERE category = ? ORDER BY order_index", (category,))
        else:
            cursor.execute("SELECT * FROM skills ORDER BY category, order_index")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

@router.post("/skills", response_model=Skill, status_code=status.HTTP_201_CREATED)
async def create_skill(skill: SkillCreate, current_user: dict = Depends(get_current_user)):
    """Create new skill"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO skills (category, name, level, icon, order_index, visible)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (skill.category, skill.name, skill.level, skill.icon, skill.order_index, skill.visible))
        
        skill_id = cursor.lastrowid
        conn.commit()
        
        cursor.execute("SELECT * FROM skills WHERE id = ?", (skill_id,))
        return dict(cursor.fetchone())

@router.put("/skills/{skill_id}", response_model=Skill)
async def update_skill(skill_id: int, skill: SkillUpdate, current_user: dict = Depends(get_current_user)):
    """Update skill"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM skills WHERE id = ?", (skill_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Skill not found")
        
        updates = []
        values = []
        for field, value in skill.dict(exclude_unset=True).items():
            updates.append(f"{field} = ?")
            values.append(value)
        
        if updates:
            values.append(skill_id)
            query = f"UPDATE skills SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
            cursor.execute(query, values)
            conn.commit()
        
        cursor.execute("SELECT * FROM skills WHERE id = ?", (skill_id,))
        return dict(cursor.fetchone())

@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(skill_id: int, current_user: dict = Depends(get_current_user)):
    """Delete skill"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM skills WHERE id = ?", (skill_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Skill not found")
        conn.commit()

# Projects Endpoints
@router.get("/projects", response_model=List[Project])
async def get_projects(featured: Optional[bool] = None):
    """Get all projects"""
    with get_db() as conn:
        cursor = conn.cursor()
        if featured is not None:
            cursor.execute("SELECT * FROM projects WHERE featured = ? AND visible = 1 ORDER BY order_index", (1 if featured else 0,))
        else:
            cursor.execute("SELECT * FROM projects WHERE visible = 1 ORDER BY order_index")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

@router.post("/projects", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(project: ProjectCreate, current_user: dict = Depends(get_current_user)):
    """Create new project"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO projects (title, description, long_description, image_url, tags, 
                                github_url, live_url, featured, visible, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (project.title, project.description, project.long_description, project.image_url,
              project.tags, project.github_url, project.live_url, project.featured, project.visible, project.order_index))
        
        project_id = cursor.lastrowid
        conn.commit()
        
        cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
        return dict(cursor.fetchone())

@router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: int, project: ProjectUpdate, current_user: dict = Depends(get_current_user)):
    """Update project"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Project not found")
        
        updates = []
        values = []
        for field, value in project.dict(exclude_unset=True).items():
            updates.append(f"{field} = ?")
            values.append(value)
        
        if updates:
            values.append(project_id)
            query = f"UPDATE projects SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
            cursor.execute(query, values)
            conn.commit()
        
        cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
        return dict(cursor.fetchone())

@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: int, current_user: dict = Depends(get_current_user)):
    """Delete project"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM projects WHERE id = ?", (project_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        conn.commit()

# Experience Endpoints
@router.get("/experience", response_model=List[Experience])
async def get_experience():
    """Get all experience entries"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM experience WHERE visible = 1 ORDER BY order_index")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

@router.post("/experience", response_model=Experience, status_code=status.HTTP_201_CREATED)
async def create_experience(experience: ExperienceCreate, current_user: dict = Depends(get_current_user)):
    """Create experience entry"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO experience (title, company, location, start_date, end_date, current, 
                                  description, technologies, visible, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (experience.title, experience.company, experience.location, experience.start_date,
              experience.end_date, experience.current, experience.description, experience.technologies,
              experience.visible, experience.order_index))
        
        exp_id = cursor.lastrowid
        conn.commit()
        
        cursor.execute("SELECT * FROM experience WHERE id = ?", (exp_id,))
        return dict(cursor.fetchone())

@router.put("/experience/{exp_id}", response_model=Experience)
async def update_experience(exp_id: int, experience: ExperienceUpdate, current_user: dict = Depends(get_current_user)):
    """Update experience entry"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM experience WHERE id = ?", (exp_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Experience not found")
        
        updates = []
        values = []
        for field, value in experience.dict(exclude_unset=True).items():
            updates.append(f"{field} = ?")
            values.append(value)
        
        if updates:
            values.append(exp_id)
            query = f"UPDATE experience SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
            cursor.execute(query, values)
            conn.commit()
        
        cursor.execute("SELECT * FROM experience WHERE id = ?", (exp_id,))
        return dict(cursor.fetchone())

@router.delete("/experience/{exp_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_experience(exp_id: int, current_user: dict = Depends(get_current_user)):
    """Delete experience entry"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM experience WHERE id = ?", (exp_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Experience not found")
        conn.commit()

# Education Endpoints
@router.get("/education", response_model=List[Education])
async def get_education():
    """Get all education entries"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM education WHERE visible = 1 ORDER BY order_index")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

@router.post("/education", response_model=Education, status_code=status.HTTP_201_CREATED)
async def create_education(education: EducationCreate, current_user: dict = Depends(get_current_user)):
    """Create education entry"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO education (degree, institution, location, start_date, end_date, 
                                 description, grade, visible, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (education.degree, education.institution, education.location, education.start_date,
              education.end_date, education.description, education.grade, education.visible, education.order_index))
        
        edu_id = cursor.lastrowid
        conn.commit()
        
        cursor.execute("SELECT * FROM education WHERE id = ?", (edu_id,))
        return dict(cursor.fetchone())

@router.put("/education/{edu_id}", response_model=Education)
async def update_education(edu_id: int, education: EducationUpdate, current_user: dict = Depends(get_current_user)):
    """Update education entry"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM education WHERE id = ?", (edu_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Education not found")
        
        updates = []
        values = []
        for field, value in education.dict(exclude_unset=True).items():
            updates.append(f"{field} = ?")
            values.append(value)
        
        if updates:
            values.append(edu_id)
            query = f"UPDATE education SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
            cursor.execute(query, values)
            conn.commit()
        
        cursor.execute("SELECT * FROM education WHERE id = ?", (edu_id,))
        return dict(cursor.fetchone())

@router.delete("/education/{edu_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_education(edu_id: int, current_user: dict = Depends(get_current_user)):
    """Delete education entry"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM education WHERE id = ?", (edu_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Education not found")
        conn.commit()

# Testimonials Endpoints
@router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    """Get all testimonials"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM testimonials WHERE visible = 1 ORDER BY order_index")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

@router.post("/testimonials", response_model=Testimonial, status_code=status.HTTP_201_CREATED)
async def create_testimonial(testimonial: TestimonialCreate, current_user: dict = Depends(get_current_user)):
    """Create testimonial"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO testimonials (name, role, company, content, image_url, rating, visible, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (testimonial.name, testimonial.role, testimonial.company, testimonial.content,
              testimonial.image_url, testimonial.rating, testimonial.visible, testimonial.order_index))
        
        test_id = cursor.lastrowid
        conn.commit()
        
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (test_id,))
        return dict(cursor.fetchone())

@router.put("/testimonials/{test_id}", response_model=Testimonial)
async def update_testimonial(test_id: int, testimonial: TestimonialUpdate, current_user: dict = Depends(get_current_user)):
    """Update testimonial"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (test_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        updates = []
        values = []
        for field, value in testimonial.dict(exclude_unset=True).items():
            updates.append(f"{field} = ?")
            values.append(value)
        
        if updates:
            values.append(test_id)
            query = f"UPDATE testimonials SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
            cursor.execute(query, values)
            conn.commit()
        
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (test_id,))
        return dict(cursor.fetchone())

@router.delete("/testimonials/{test_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_testimonial(test_id: int, current_user: dict = Depends(get_current_user)):
    """Delete testimonial"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM testimonials WHERE id = ?", (test_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        conn.commit()

# Services Endpoints
@router.get("/services", response_model=List[Service])
async def get_services():
    """Get all services"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM services WHERE visible = 1 ORDER BY order_index")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

@router.post("/services", response_model=Service, status_code=status.HTTP_201_CREATED)
async def create_service(service: ServiceCreate, current_user: dict = Depends(get_current_user)):
    """Create service"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO services (title, description, icon, features, visible, order_index)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (service.title, service.description, service.icon, service.features, service.visible, service.order_index))
        
        service_id = cursor.lastrowid
        conn.commit()
        
        cursor.execute("SELECT * FROM services WHERE id = ?", (service_id,))
        return dict(cursor.fetchone())

@router.put("/services/{service_id}", response_model=Service)
async def update_service(service_id: int, service: ServiceUpdate, current_user: dict = Depends(get_current_user)):
    """Update service"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM services WHERE id = ?", (service_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Service not found")
        
        updates = []
        values = []
        for field, value in service.dict(exclude_unset=True).items():
            updates.append(f"{field} = ?")
            values.append(value)
        
        if updates:
            values.append(service_id)
            query = f"UPDATE services SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
            cursor.execute(query, values)
            conn.commit()
        
        cursor.execute("SELECT * FROM services WHERE id = ?", (service_id,))
        return dict(cursor.fetchone())

@router.delete("/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(service_id: int, current_user: dict = Depends(get_current_user)):
    """Delete service"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM services WHERE id = ?", (service_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Service not found")
        conn.commit()

# Contact Endpoint
@router.post("/contact", status_code=status.HTTP_201_CREATED)
async def submit_contact(message: ContactMessage):
    """Submit contact message"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO contact_messages (name, email, subject, message, status)
            VALUES (?, ?, ?, ?, ?)
        """, (message.name, message.email, message.subject, message.message, "unread"))
        conn.commit()
        
        return {"message": "Contact message sent successfully"}

@router.get("/contact-messages")
async def get_contact_messages(current_user: dict = Depends(get_current_user)):
    """Get all contact messages (admin only)"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM contact_messages ORDER BY created_at DESC")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
