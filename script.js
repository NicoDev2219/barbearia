// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const header = document.getElementById('header');
const scrollIndicator = document.querySelector('.scroll-indicator');
const bookingForm = document.getElementById('booking-form');
const contactForm = document.getElementById('contact-form');

// Initialize quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Função principal de inicialização
function initializeApp() {
    setupMobileMenu();
    setupScrollEffects();
    setupSmoothScrolling();
    setupFormValidation();
    setupAnimations();
    setupCounterAnimation();
    setupDateValidation();
}

// Menu Mobile Toggle
function setupMobileMenu() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

// Efeitos de Scroll
function setupScrollEffects() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header background change
        if (header) {
            if (scrollTop > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = '#ffffff';
                header.style.backdropFilter = 'none';
            }
        }

        // Hide/Show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            if (header) {
                header.style.transform = 'translateY(-100%)';
            }
        } else {
            // Scrolling up
            if (header) {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        
        // Scroll indicator
        if (scrollIndicator) {
            if (scrollTop > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        }
        
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero && scrollTop < window.innerHeight) {
            const heroImage = document.querySelector('.hero-image');
            if (heroImage) {
                heroImage.style.transform = `translateY(${scrollTop * 0.5}px)`;
            }
        }
        
        // Reveal animations
        revealOnScroll();
    });
}

// Smooth Scrolling
function setupSmoothScrolling() {
    // Scroll indicator click
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const servicesSection = document.getElementById('servicos');
            if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // All anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animações de revelação no scroll
function revealOnScroll() {
    const reveals = document.querySelectorAll('.service-card, .contact-item, .about-text, .about-image');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('fade-in');
        }
    });
}

// Setup das animações
function setupAnimations() {
    // Intersection Observer para animações mais suaves
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const elementsToAnimate = document.querySelectorAll('.service-card, .contact-item');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Animação dos contadores
function setupCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    
    function animateCounters() {
        if (countersAnimated) return;
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
        
        countersAnimated = true;
    }
    
    // Trigger animation when about section is visible
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        const aboutObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });
        
        aboutObserver.observe(aboutSection);
    }
}

// Validação de formulários
function setupFormValidation() {
    // Formulário de agendamento
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateBookingForm()) {
                submitBookingForm();
            }
        });
        
        // Validação em tempo real
        const inputs = bookingForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
    
    // Formulário de contato
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm()) {
                submitContactForm();
            }
        });
    }
}

// Validação do formulário de agendamento
function validateBookingForm() {
    const nome = document.getElementById('nome');
    const telefone = document.getElementById('telefone');
    const email = document.getElementById('email');
    const servico = document.getElementById('servico');
    const data = document.getElementById('data');
    const horario = document.getElementById('horario');
    
    let isValid = true;
    
    // Reset previous errors
    clearErrors();
    
    // Validar nome
    if (!nome.value.trim()) {
        showError(nome, 'Nome é obrigatório');
        isValid = false;
    }
    
    // Validar telefone
    if (!telefone.value.trim()) {
        showError(telefone, 'Telefone é obrigatório');
        isValid = false;
    } else if (!isValidPhone(telefone.value)) {
        showError(telefone, 'Formato de telefone inválido');
        isValid = false;
    }
    
    // Validar email
    if (!email.value.trim()) {
        showError(email, 'E-mail é obrigatório');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, 'E-mail inválido');
        isValid = false;
    }
    
    // Validar serviço
    if (!servico.value) {
        showError(servico, 'Selecione um serviço');
        isValid = false;
    }
    
    // Validar data
    if (!data.value) {
        showError(data, 'Selecione uma data');
        isValid = false;
    } else if (!isValidDate(data.value)) {
        showError(data, 'Data deve ser futura');
        isValid = false;
    }
    
    // Validar horário
    if (!horario.value) {
        showError(horario, 'Selecione um horário');
        isValid = false;
    }
    
    return isValid;
}

// Validação do formulário de contato
function validateContactForm() {
    const inputs = contactForm.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Validar campo individual
function validateField(field) {
    const value = field.value.trim();
    
    // Remove error state
    field.classList.remove('error');
    hideError(field);
    
    // Check if required
    if (field.hasAttribute('required') && !value) {
        showError(field, `${field.previousElementSibling.textContent} é obrigatório`);
        return false;
    }
    
    // Specific validations
    switch (field.type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showError(field, 'E-mail inválido');
                return false;
            }
            break;
        case 'tel':
            if (value && !isValidPhone(value)) {
                showError(field, 'Formato de telefone inválido');
                return false;
            }
            break;
        case 'date':
            if (value && !isValidDate(value)) {
                showError(field, 'Data deve ser futura');
                return false;
            }
            break;
    }
    
    return true;
}

// Funções de utilidade para validação
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\(\)\s\-\+\d]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function isValidDate(date) {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}

// Mostrar erro
function showError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

// Esconder erro
function hideError(field) {
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Limpar todos os erros
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.classList.remove('show'));
    
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
}

// Submeter formulário de agendamento
function submitBookingForm() {
    showLoading();
    
    // Simular envio
    setTimeout(() => {
        hideLoading();
        showSuccessMessage('Agendamento realizado com sucesso! Entraremos em contato para confirmar.');
        bookingForm.reset();
    }, 2000);
}

// Submeter formulário de contato
function submitContactForm() {
    showLoading();
    
    // Simular envio
    setTimeout(() => {
        hideLoading();
        showSuccessMessage('Mensagem enviada com sucesso! Responderemos em breve.');
        contactForm.reset();
    }, 2000);
}

// Mostrar loading
function showLoading() {
    let loading = document.querySelector('.loading');
    if (!loading) {
        loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loading);
    }
    loading.classList.add('active');
}

// Esconder loading
function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.classList.remove('active');
    }
}

// Mostrar mensagem de sucesso
function showSuccessMessage(message) {
    let successElement = document.querySelector('.success-message');
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.className = 'success-message';
        
        // Insert before form
        const form = document.querySelector('.booking-form, .contact-form');
        if (form) {
            form.parentNode.insertBefore(successElement, form);
        }
    }
    
    successElement.textContent = message;
    successElement.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successElement.classList.remove('show');
    }, 5000);
}

// Configurar validação de data
function setupDateValidation() {
    const dateInput = document.getElementById('data');
    if (dateInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        
        // Disable sundays and specific dates
        dateInput.addEventListener('input', function() {
            const selectedDate = new Date(this.value);
            const dayOfWeek = selectedDate.getDay();
            
            // Domingo = 0
            if (dayOfWeek === 0) {
                showError(this, 'Não atendemos aos domingos');
                this.value = '';
            }
        });
    }
}

// Formatação automática de telefone
function setupPhoneFormatting() {
    const phoneInput = document.getElementById('telefone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
                value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
                this.value = value;
            }
        });
    }
}

// Lazy loading para imagens (se implementar imagens reais)
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Scroll to top functionality
function addScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--gradient-orange);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: var(--transition);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    `;
    
    document.body.appendChild(scrollBtn);
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
}

// Inicializar funcionalidades adicionais
setTimeout(() => {
    setupPhoneFormatting();
    addScrollToTop();
    setupLazyLoading();
}, 100);