"""
Populate database with Durgaraj Chauhan's portfolio data
"""
import sqlite3
from datetime import datetime
import os

# Get the database path
db_path = os.path.join(os.path.dirname(__file__), 'portfolio.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

def populate_data():
    try:
        # 1. Hero Section
        cursor.execute("""
            INSERT OR REPLACE INTO hero (id, title, subtitle, description, cta_text, cta_link, 
            background_type, background_value, social_links, visible, order_index)
            VALUES (1, 'Durgaraj Chauhan', 
            'AI Engineer | LLM & Agentic Systems Specialist',
            'AI Engineer with 2.5+ years of hands-on experience designing and deploying LLM-powered, Generative AI, and Agentic AI systems in production. Strong expertise in LLMs, RAG pipelines, conversational AI (chatbots & callbots), computer vision, and AI automation. Proven ability to build scalable, low-latency AI services using Python, FastAPI, Docker, AWS, and modern vector databases.',
            'View My Work', '#projects', 'gradient', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '{"linkedin":"https://www.linkedin.com/in/durgaraj-chauhan/","twitter":"https://twitter.com/Durgaraj07","github":"https://github.com/DurgarajC07"}',
            1, 0)
        """)

        # 2. About Section
        cursor.execute("""
            INSERT OR REPLACE INTO about (id, title, description, image_url, location, 
            stats, visible, order_index)
            VALUES (1, 'About Me',
            'AI Engineer with 2.5+ years of hands-on experience designing and deploying LLM-powered, Generative AI, and Agentic AI systems in production. Strong expertise in LLMs, RAG pipelines, conversational AI (chatbots & callbots), computer vision, and AI automation. Proven ability to build scalable, low-latency AI services using Python, FastAPI, Docker, AWS, and modern vector databases. Experienced in taking AI solutions from research → production → scale.',
            '/profile.jpg', 'Mumbai, India',
            '{"years":"2.5+","projects":"15+","clients":"10+"}',
            1, 1)
        """)

        # 3. Skills
        skills = [
            ('Programming', 'Python', 95, 'code', 1),
            ('Framework', 'FastAPI', 90, 'zap', 2),
            ('Framework', 'Flask', 85, 'server', 3),
            ('Framework', 'Django', 80, 'database', 4),
            ('Frontend', 'React', 85, 'layout', 5),
            ('Programming', 'JavaScript', 85, 'code', 6),
            ('Backend', 'REST APIs', 95, 'link', 7),
            ('Backend', 'WebSockets', 85, 'radio', 8),
            ('Database', 'Redis', 85, 'database', 9),
            ('Database', 'MySQL', 90, 'database', 10),
            ('Database', 'SQLite', 85, 'database', 11),
            ('Database', 'MongoDB', 80, 'database', 12),
            ('Cloud', 'AWS', 85, 'cloud', 13),
            ('Cloud', 'Azure', 75, 'cloud', 14),
            ('DevOps', 'Docker', 90, 'box', 15),
            ('Version Control', 'Git', 95, 'git-branch', 16),
            ('AI/ML', 'LLMs', 95, 'brain', 17),
            ('AI/ML', 'Agentic AI', 90, 'cpu', 18),
            ('AI/ML', 'GenAI', 90, 'sparkles', 19),
            ('AI/ML', 'Computer Vision', 85, 'eye', 20),
            ('AI/ML', 'NLP', 85, 'message-square', 21),
            ('AI/ML', 'OpenCV', 85, 'camera', 22),
        ]
        
        for category, name, level, icon, order in skills:
            cursor.execute("""
                INSERT OR REPLACE INTO skills (category, name, level, icon, visible, order_index)
                VALUES (?, ?, ?, ?, 1, ?)
            """, (category, name, level, icon, order))

        # 4. Projects
        projects = [
            (
                'AI Callbot System',
                'Built an end-to-end AI Calling system using LLMs, FastAPI, Redis, and custom TTS/STT pipelines. Implemented low-latency voice interaction using Whisper STT + Kokoro-82M/Coqui TTS. Designed a context-aware conversational engine with session persistence. Developed a RAG pipeline using Qdrant for grounded responses.',
                'Comprehensive AI callbot system with custom TTS/STT pipelines, LLM integration, RAG capabilities, and session management. Features low-latency voice interactions (<500ms), context persistence across conversations, and scalable architecture deployed on AWS.',
                '/project-callbot.jpg',
                'Python,FastAPI,Redis,LLMs,Whisper,RAG,Qdrant,Docker,AWS',
                'https://github.com/DurgarajC07/ai-callbot',
                '',
                1,
                1,
                1
            ),
            (
                'Insurance Damage Estimation Platform',
                'Built a complete end-to-end insurance claim automation platform with user portal, backend APIs, AI pipelines, and automated reporting. Implemented document parsing & OCR extraction, damage detection using Computer Vision, and dynamic cost mapping engine.',
                'Full-stack insurance claim automation with OCR-based document extraction, computer vision damage detection, cost estimation algorithms, and PDF report generation. System processes multiple document types (RC, DL, Aadhaar, PAN, Insurance) and generates comprehensive claim reports.',
                '/project-insurance.jpg',
                'Python,Computer Vision,OCR,FastAPI,Document Processing,PDF Generation',
                'https://github.com/DurgarajC07/insurance-platform',
                '',
                1,
                1,
                2
            ),
            (
                'Content Management System',
                'Dynamic CMS with role-based access control and media management built with modern web technologies.',
                'Full-featured content management system with RBAC, media library, SEO tools, and RESTful APIs. Built with Laravel and modern frontend frameworks.',
                '/project-cms.jpg',
                'Laravel,PHP,MySQL,JavaScript,REST APIs',
                'https://github.com/DurgarajC07/cms',
                '',
                0,
                1,
                3
            ),
        ]
        
        for title, desc, long_desc, img, tags, github, demo, featured, visible, order in projects:
            cursor.execute("""
                INSERT OR REPLACE INTO projects (title, description, long_description, image_url, 
                tags, github_url, live_url, featured, visible, order_index)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (title, desc, long_desc, img, tags, github, demo, featured, visible, order))

        # 5. Experience
        experiences = [
            (
                'Sr. Software Engineer',
                'Anvex AI Technologies',
                'Hybrid (Vashi, Navi Mumbai)',
                '2025-01',
                None,
                1,
                """Designed and deployed AI-powered chatbots & callbots using VAPI, FastAPI, Redis for real-time conversations.
Built context-aware LLM pipelines supporting seamless chat and call transitions.
Integrated GenAI models to automate workflows like voice summarization, form autofill, and ticket creation.
Developed agentic automation systems reducing manual tasks by up to 60%.
Implemented Vision-Language Model (VLM) pipelines for invoice & bank-statement processing.
Deployed scalable microservices using Docker and AWS.""",
                'Python,FastAPI,LLMs,GenAI,Docker,AWS,Redis',
                1,
                1
            ),
            (
                'Jr. Web Developer',
                'Reboot Technology Pvt. Ltd.',
                'Belapur (Navi Mumbai)',
                '2024-06',
                '2025-01',
                0,
                """Built Python CV projects: Car detection & live vehicle counting using YOLO + IP Camera, Face recognition pipeline.
Developed secure web solutions: DocuSign Integration, Twilio 2FA, Screen Recorder Tools, QR Check-in System.
Payment integration (Stripe/Razorpay), subscription APIs, and REST authentication flows.
Built and deployed production-ready APIs in Laravel, PHP, Python.
Generated video thumbnails using FFmpeg, implemented cloud storage (AWS S3).
Delivered multiple client projects independently and received 3× Employee of the Month.""",
                'Python,PHP,Laravel,YOLO,OpenCV,FFmpeg,AWS S3,Stripe,Razorpay',
                1,
                2
            ),
        ]
        
        for title, company, location, start, end, current, desc, tech, visible, order in experiences:
            cursor.execute("""
                INSERT OR REPLACE INTO experience (title, company, location, start_date, end_date, 
                current, description, technologies, visible, order_index)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (title, company, location, start, end, current, desc, tech, visible, order))

        # 6. Education
        educations = [
            (
                'Bachelor of Engineering',
                'Saraswati College of Engineering, Kharghar',
                'Kharghar',
                '2020-10',
                '2023-05',
                'Computer Engineering - Focused on AI/ML and software development.',
                '78.34%',
                1,
                1
            ),
            (
                'Diploma in Computer Engineering',
                'Saraswati Institute of Technology, Kharghar',
                'Kharghar',
                '2017-07',
                '2020-05',
                'Computer Engineering - Strong foundation in programming and systems.',
                '90.91%',
                1,
                2
            ),
        ]
        
        for degree, institution, location, start, end, desc, grade, visible, order in educations:
            cursor.execute("""
                INSERT OR REPLACE INTO education (degree, institution, location, start_date, 
                end_date, description, grade, visible, order_index)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (degree, institution, location, start, end, desc, grade, visible, order))

        # 7. Certifications
        certifications = [
            ('Python Certification', 'Professional Certification', '2023-01', None, None, '', 1, 1),
            ('PSD to HTML', 'Web Development', '2023-02', None, None, '', 1, 2),
            ('MVC Architecture', 'Software Architecture', '2023-03', None, None, '', 1, 3),
            ('Laravel Master', 'Framework Certification', '2023-04', None, None, '', 1, 4),
        ]
        
        for name, issuer, date, expiry, cred_id, url, visible, order in certifications:
            cursor.execute("""
                INSERT OR REPLACE INTO certifications (name, issuer, issue_date, expiry_date,
                credential_id, credential_url, visible, order_index)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (name, issuer, date, expiry, cred_id, url, visible, order))

        # 8. Services
        services = [
            (
                'LLM & Generative AI Solutions',
                'Design and deploy production-ready LLM-powered applications, RAG pipelines, and agentic AI systems.',
                'brain',
                1,
                1
            ),
            (
                'AI Chatbot & Callbot Development',
                'Build context-aware conversational AI systems with seamless voice and chat capabilities.',
                'message-square',
                1,
                2
            ),
            (
                'Computer Vision Solutions',
                'Develop custom CV pipelines for object detection, face recognition, and document processing.',
                'eye',
                1,
                3
            ),
            (
                'Backend API Development',
                'Create scalable REST APIs and microservices using FastAPI, Flask, and Django.',
                'server',
                1,
                4
            ),
            (
                'AI Automation & Integration',
                'Automate workflows with AI agents, reduce manual tasks, and integrate AI into existing systems.',
                'zap',
                1,
                5
            ),
            (
                'Cloud Deployment & DevOps',
                'Deploy and scale applications using Docker, AWS, and CI/CD pipelines.',
                'cloud',
                1,
                6
            ),
        ]
        
        for title, desc, icon, visible, order in services:
            cursor.execute("""
                INSERT OR REPLACE INTO services (title, description, icon, visible, order_index)
                VALUES (?, ?, ?, ?, ?)
            """, (title, desc, icon, visible, order))

        # 9. Testimonials
        testimonials = [
            (
                'Rajesh Kumar',
                'Tech Lead',
                'Anvex AI Technologies',
                'Durgaraj consistently delivered complex AI solutions with exceptional quality. His expertise in LLMs and RAG pipelines helped us build a production-ready system that handles thousands of requests daily.',
                '/testimonial-1.jpg',
                5,
                1,
                1
            ),
            (
                'Priya Sharma',
                'Project Manager',
                'Reboot Technology',
                'Received Employee of the Month 3 times for exceptional project delivery and technical skills. Always goes above and beyond to ensure client satisfaction. A true asset to any team.',
                '/testimonial-2.jpg',
                5,
                1,
                2
            ),
        ]
        
        for name, role, company, content, img, rating, visible, order in testimonials:
            cursor.execute("""
                INSERT OR REPLACE INTO testimonials (name, role, company, content, 
                image_url, rating, visible, order_index)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (name, role, company, content, img, rating, visible, order))

        # 10. Blog Posts
        blogs = [
            (
                'Building Production-Ready RAG Systems',
                'building-production-ready-rag-systems',
                """# Building Production-Ready RAG Systems

In this comprehensive guide, I'll walk you through building a production-ready RAG (Retrieval-Augmented Generation) system.

## Architecture Overview
- Vector Database: Qdrant
- Embeddings: sentence-transformers
- LLM: Claude/OpenAI
- Backend: FastAPI
- Caching: Redis

## Key Components
1. Document ingestion pipeline
2. Embedding generation
3. Vector search optimization
4. Context injection
5. Response generation

## Best Practices
- Hybrid search for better accuracy
- Caching frequently accessed vectors
- Monitoring and logging
- Error handling and fallbacks

This architecture has been battle-tested in production with thousands of queries per day.""",
                'Learn how to build scalable RAG pipelines using Qdrant, LLMs, and FastAPI for production environments.',
                '/blog-rag.jpg',
                'AI/ML',
                'AI,RAG,LLMs,Python',
                'Building Production-Ready RAG Systems | Durgaraj Chauhan',
                'Learn how to build scalable RAG pipelines using Qdrant, LLMs, and FastAPI for production environments.',
                'RAG, LLM, AI, Vector Database, Qdrant',
                'published',
                1,
                150,
                '2025-01-15 10:00:00',
                1
            ),
            (
                'LLM-Powered Callbots: A Complete Guide',
                'llm-powered-callbots-complete-guide',
                """# LLM-Powered Callbots: A Complete Guide

Building a production-ready AI callbot requires careful consideration of multiple components.

## System Architecture
- Speech-to-Text: Whisper
- Text-to-Speech: Kokoro-82M/Coqui
- LLM: Claude/GPT-4
- Session Management: Redis
- API Framework: FastAPI

## Key Challenges
1. Low latency requirements
2. Context persistence
3. Natural voice synthesis
4. Error handling in real-time

## Performance Optimization
- Streaming responses
- Audio buffer management
- Concurrent request handling
- Resource optimization

The system achieves <500ms latency for most interactions.""",
                'Deep dive into building AI callbots with custom TTS/STT pipelines, context management, and low-latency voice interactions.',
                '/blog-callbot.jpg',
                'AI/ML',
                'AI,LLMs,Voice,TTS,STT',
                'LLM-Powered Callbots: A Complete Guide | Durgaraj Chauhan',
                'Deep dive into building AI callbots with custom TTS/STT pipelines and low-latency voice interactions.',
                'LLM, Callbot, Voice AI, TTS, STT, Whisper',
                'published',
                1,
                200,
                '2025-01-20 14:00:00',
                2
            ),
            (
                'Computer Vision for Insurance Claims',
                'computer-vision-insurance-claims',
                """# Computer Vision for Insurance Claims

Automating insurance claim processing with Computer Vision.

## Problem Statement
Manual inspection is slow, inconsistent, and costly.

## Our Solution
- Damage detection with bounding boxes
- Severity classification
- Part identification
- Cost estimation automation

## Technical Stack
- OpenCV for image processing
- YOLO for object detection
- FastAPI for API layer
- OCR for document extraction

## Results
- 60% reduction in processing time
- 95% accuracy in damage detection
- Significant cost savings

The system processes thousands of claims efficiently.""",
                'How we built an automated damage detection system using CV and ML to streamline insurance claim processing.',
                '/blog-cv.jpg',
                'Computer Vision',
                'Computer Vision,ML,Insurance,Python',
                'Computer Vision for Insurance Claims | Durgaraj Chauhan',
                'Automated damage detection system using Computer Vision and ML for insurance claims.',
                'Computer Vision, Insurance, YOLO, OCR, Automation',
                'published',
                0,
                180,
                '2025-01-25 16:00:00',
                3
            ),
        ]
        
        for title, slug, content, excerpt, img, category, tags, meta_title, meta_desc, meta_keywords, status, featured, views, published, order in blogs:
            cursor.execute("""
                INSERT OR REPLACE INTO blogs (title, slug, content, excerpt, image_url, category,
                tags, meta_title, meta_description, meta_keywords, status, featured, views, 
                published_at, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """, (title, slug, content, excerpt, img, category, tags, meta_title, meta_desc, meta_keywords, status, featured, views, published))

        # 8. Services
        services = [
            (
                'LLM & Generative AI Solutions',
                'Design and deploy production-ready LLM-powered applications, RAG pipelines, and agentic AI systems.',
                'brain',
                'Custom LLM Integration,RAG Pipeline Development,Agentic AI Systems,Prompt Engineering',
                1,
                1
            ),
            (
                'AI Chatbot & Callbot Development',
                'Build context-aware conversational AI systems with seamless voice and chat capabilities.',
                'message-square',
                'Voice AI Integration,Chat Systems,Context Management,Real-time Processing',
                1,
                2
            ),
            (
                'Computer Vision Solutions',
                'Develop custom CV pipelines for object detection, face recognition, and document processing.',
                'eye',
                'Object Detection,Image Classification,OCR,Face Recognition',
                1,
                3
            ),
            (
                'Backend API Development',
                'Create scalable REST APIs and microservices using FastAPI, Flask, and Django.',
                'server',
                'REST APIs,Microservices,Database Design,Authentication',
                1,
                4
            ),
            (
                'AI Automation & Integration',
                'Automate workflows with AI agents, reduce manual tasks, and integrate AI into existing systems.',
                'zap',
                'Workflow Automation,AI Integration,Process Optimization,Task Automation',
                1,
                5
            ),
            (
                'Cloud Deployment & DevOps',
                'Deploy and scale applications using Docker, AWS, and CI/CD pipelines.',
                'cloud',
                'Docker,AWS,CI/CD,Infrastructure',
                1,
                6
            ),
        ]
        
        for title, desc, icon, features, visible, order in services:
            cursor.execute("""
                INSERT OR REPLACE INTO services (title, description, icon, features, visible, order_index)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (title, desc, icon, features, visible, order))

        # 11. Site Settings
        cursor.execute("""
            INSERT OR REPLACE INTO site_settings (id, site_name, site_description, site_url,
            contact_email, google_analytics, robots_txt)
            VALUES (1, 'Durgaraj Chauhan - AI Engineer', 
            'AI Engineer with 2.5+ years of hands-on experience in LLM-powered, Generative AI, and Agentic AI systems.',
            'http://localhost:3000',
            'durgarajchauhan@gmail.com',
            '',
            'User-agent: *\nAllow: /\nSitemap: http://localhost:3000/sitemap.xml')
        """)

        # 12. Theme Settings
        cursor.execute("""
            INSERT OR REPLACE INTO theme_settings (id, primary_color, secondary_color, accent_color,
            font_primary, font_secondary, font_code, dark_mode, logo_url, favicon_url, custom_css)
            VALUES (1, '#3b82f6', '#8b5cf6', '#10b981',
            'Inter', 'Poppins', 'Fira Code',
            1, '/logo.png', '/favicon.ico', '')
        """)

        # 13. SEO Pages
        seo_pages = [
            ('home', 'Durgaraj Chauhan - AI Engineer | LLM & Agentic Systems',
             'AI Engineer with 2.5+ years of experience in LLM-powered, Generative AI, and Agentic AI systems.',
             'AI Engineer, LLM, Generative AI, Agentic AI, RAG'),
            ('about', 'About Durgaraj Chauhan - AI Engineer',
             'Learn more about Durgaraj Chauhan, an experienced AI Engineer.',
             'About, AI Engineer, Experience'),
            ('projects', 'Projects - AI & Machine Learning Solutions',
             'Explore my portfolio of AI projects.',
             'Projects, AI Projects'),
            ('blog', 'Blog - AI Engineering Insights',
             'Read articles about AI engineering.',
             'Blog, AI, Machine Learning'),
        ]
        
        for page, title, desc, keywords in seo_pages:
            cursor.execute("""
                INSERT OR REPLACE INTO seo_pages (page_name, meta_title, meta_description, meta_keywords)
                VALUES (?, ?, ?, ?)
            """, (page, title, desc, keywords))

        conn.commit()
        print("✅ Database populated successfully with Durgaraj Chauhan's data!")
        print("\n📊 Summary:")
        print(f"   - Hero section: 1 entry")
        print(f"   - About section: 1 entry")
        print(f"   - Skills: {len(skills)} entries")
        print(f"   - Projects: {len(projects)} entries")
        print(f"   - Experience: {len(experiences)} entries")
        print(f"   - Education: {len(educations)} entries")
        print(f"   - Certifications: {len(certifications)} entries")
        print(f"   - Services: {len(services)} entries")
        print(f"   - Testimonials: {len(testimonials)} entries")
        print(f"   - Blog posts: {len(blogs)} entries")
        print(f"   - Site settings: 1 entry")
        print(f"   - Theme settings: 1 entry")
        print(f"   - SEO pages: {len(seo_pages)} entries")
        
    except Exception as e:
        print(f"❌ Error populating database: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    populate_data()
