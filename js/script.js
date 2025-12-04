// ==================== DOM ELEMENTS ====================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopButton = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('.section');

// ==================== DATA LOADING ====================
let skillsData = [];
let educationData = [];
let experienceData = [];
let projectsData = [];
let achievementsData = [];
let blogData = [];

async function loadData() {
    try {
        const [skills, education, experience, projects, achievements, blog] = await Promise.all([
            fetch('data/skills.json').then(res => res.json()),
            fetch('data/education.json').then(res => res.json()),
            fetch('data/experience.json').then(res => res.json()),
            fetch('data/projects.json').then(res => res.json()),
            fetch('data/achievements.json').then(res => res.json()),
            fetch('data/blog.json').then(res => res.json())
        ]);

        skillsData = skills.skills;
        educationData = education.education;
        experienceData = experience.experience;
        projectsData = projects.projects;
        achievementsData = achievements.achievements;
        blogData = blog.posts;

        renderSkills();
        renderEducation();
        renderExperience();
        renderProjects();
        renderAchievements();
        renderBlog();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// ==================== RENDER SKILLS ====================
function renderSkills() {
    const skillTagsContainer = document.querySelector('.skill-tags');
    if (!skillTagsContainer || skillsData.length === 0) return;

    skillTagsContainer.innerHTML = skillsData.map(skill => 
        `<span class="skill-tag" data-category="${skill.category}">${skill.name}</span>`
    ).join('');

    // Re-initialize skill animations
    initSkillTagAnimation();
}

// ==================== RENDER EDUCATION ====================
function renderEducation() {
    const timelineContainer = document.querySelector('.education-timeline');
    if (!timelineContainer || educationData.length === 0) return;

    timelineContainer.innerHTML = educationData.map(edu => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h3>${edu.degree}</h3>
                <p class="institution">${edu.institution}</p>
                <p class="timeline-date">${edu.duration}</p>
                <p class="timeline-description">${edu.description}</p>
            </div>
        </div>
    `).join('');
}

// ==================== RENDER EXPERIENCE ====================
function renderExperience() {
    const experienceGrid = document.querySelector('.experience-grid');
    if (!experienceGrid || experienceData.length === 0) return;

    experienceGrid.innerHTML = experienceData.map(exp => `
        <div class="experience-card">
            <div class="experience-header">
                <h3>${exp.title}</h3>
                <span class="experience-duration">${exp.duration}</span>
            </div>
            <p class="experience-company">${exp.company}</p>
            <ul class="experience-list">
                ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

// ==================== RENDER PROJECTS ====================
function renderProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid || projectsData.length === 0) return;

    projectsGrid.innerHTML = projectsData.map(project => `
        <div class="project-card">
            <div class="project-image">
                <div class="image-placeholder">Project Screenshot</div>
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="#" class="project-link view-details" data-project="${project.id}">View Details</a>
                    <a href="${project.sourceUrl}" class="project-link">Source Code</a>
                </div>
            </div>
        </div>
    `).join('');

    // Re-initialize project modal after rendering
    initProjectModal();
}

// ==================== RENDER ACHIEVEMENTS ====================
function renderAchievements() {
    const achievementsGrid = document.querySelector('.achievements-grid');
    if (!achievementsGrid || achievementsData.length === 0) return;

    achievementsGrid.innerHTML = achievementsData.map(achievement => `
        <div class="achievement-card">
            <div class="achievement-icon">${achievement.icon}</div>
            <h3>${achievement.title}</h3>
            <p>${achievement.description}</p>
        </div>
    `).join('');
}

// ==================== RENDER BLOG ====================
function renderBlog() {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid || blogData.length === 0) return;

    blogGrid.innerHTML = blogData.map(post => `
        <article class="blog-card">
            <div class="blog-image">
                <div class="image-placeholder">Blog Image</div>
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-category">${post.category}</span>
                    <span class="blog-date">${post.date}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <div class="blog-footer">
                    <span class="read-time">${post.readTime}</span>
                    <a href="${post.url}" class="read-more">Read More →</a>
                </div>
            </div>
        </article>
    `).join('');
}

// ==================== MOBILE MENU TOGGLE ====================
function initMobileMenu() {
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.hamburger')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ==================== ACTIVE NAVIGATION LINK ====================
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;

    navLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// ==================== BACK TO TOP BUTTON ====================
function initBackToTop() {
    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== NAVBAR SCROLL EFFECT ====================
function initNavbarScroll() {
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Observe cards and timeline items
    const animatedElements = document.querySelectorAll(
        '.project-card, .experience-card, .achievement-card, .blog-card, .timeline-item'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ==================== CONTACT FORM VALIDATION ====================
function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        // Validate all fields
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        // Validate email format
        if (!isValidEmail(formData.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Success - In production, you would send this data to a server
        console.log('Form Data:', formData);
        showNotification('Thank you for your message! I will get back to you soon.', 'success');
        contactForm.reset();
    });
}

// ==================== EMAIL VALIDATION ====================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        backgroundColor: type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '350px'
    });

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const targetPosition = target.offsetTop - 80;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== TYPING EFFECT FOR HERO SUBTITLE ====================
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.borderRight = '2px solid';
    subtitle.style.paddingRight = '5px';

    let index = 0;
    const typingSpeed = 100;

    function type() {
        if (index < text.length) {
            subtitle.textContent += text.charAt(index);
            index++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(() => {
                subtitle.style.borderRight = 'none';
            }, 500);
        }
    }

    // Start typing after a short delay
    setTimeout(type, 500);
}

// ==================== PROJECT CARD TILT EFFECT ====================
function initCardTiltEffect() {
    const cards = document.querySelectorAll('.project-card, .experience-card, .achievement-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ==================== SKILL TAG ANIMATION ====================
function initSkillTagAnimation() {
    const skillTags = document.querySelectorAll('.skill-tag');

    skillTags.forEach((tag, index) => {
        tag.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
        tag.style.opacity = '0';
    });
}

// ==================== SKILL FILTER FUNCTIONALITY ====================
function initSkillFilter() {
    const filterButtons = document.querySelectorAll('.skill-filter-btn');
    const skillTags = document.querySelectorAll('.skill-tag');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');

            // Get the selected category
            const category = button.getAttribute('data-category');

            // Filter skill tags with animation
            skillTags.forEach((tag, index) => {
                const tagCategory = tag.getAttribute('data-category');
                
                if (category === 'all' || tagCategory === category) {
                    tag.classList.remove('hidden');
                    // Re-animate visible tags
                    setTimeout(() => {
                        tag.style.animation = `fadeInUp 0.4s ease ${index * 0.05}s forwards`;
                    }, 10);
                } else {
                    tag.classList.add('hidden');
                }
            });
        });
    });
}

// ==================== LAZY LOADING FOR IMAGES ====================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ==================== COUNTER ANIMATION FOR ACHIEVEMENTS ====================
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                let current = 0;
                const increment = target / 50;
                const duration = 2000;
                const stepTime = duration / 50;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        setTimeout(updateCounter, stepTime);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    });

    counters.forEach(counter => counterObserver.observe(counter));
}

// ==================== THEME TOGGLE (Optional Enhancement) ====================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Add a nice rotation animation to the button
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });
}

// ==================== PARALLAX EFFECT FOR HERO ====================
function initParallaxEffect() {
    const heroBackground = document.querySelector('.hero-background');
    if (!heroBackground) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
}

// ==================== PROJECT MODAL ====================
function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalClose = document.querySelector('.modal-close');
    const viewDetailsButtons = document.querySelectorAll('.view-details');

    if (!modal) return;

    // Open modal
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = button.getAttribute('data-project');
            const project = projectsData.find(p => p.id === projectId);

            if (project) {
                // Populate modal content
                document.querySelector('.modal-title').textContent = project.title;
                document.querySelector('.modal-description').textContent = project.detailedDescription;

                // Tags
                const tagsContainer = document.querySelector('.modal-tags');
                tagsContainer.innerHTML = project.tags.map(tag => `<span>${tag}</span>`).join('');

                // Features
                const featuresList = document.querySelector('.modal-features-list');
                featuresList.innerHTML = project.features.map(feature => `<li>${feature}</li>`).join('');

                // Technologies
                const techList = document.querySelector('.modal-tech-list');
                techList.innerHTML = project.technologies.map(tech => `<span>${tech}</span>`).join('');

                // Links
                document.querySelector('.modal-demo').href = project.demoUrl;
                document.querySelector('.modal-source').href = project.sourceUrl;

                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ==================== INITIALIZE ALL FUNCTIONS ====================
async function init() {
    // Load data first
    await loadData();

    // Core functionality
    initMobileMenu();
    initBackToTop();
    initNavbarScroll();
    initSmoothScroll();
    initContactForm();
    initScrollAnimations();
    initThemeToggle();
    initProjectModal();

    // Enhanced effects
    initTypingEffect();
    initCardTiltEffect();
    initSkillTagAnimation();
    initSkillFilter();
    initLazyLoading();
    initCounterAnimation();
    initParallaxEffect();

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// ==================== PAGE LOAD ====================
// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ==================== ADD NOTIFICATION ANIMATIONS ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
