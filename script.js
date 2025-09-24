// Smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link")
  const ctaButton = document.querySelector(".cta-button")

  // Add smooth scrolling to all navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80 // Account for fixed navbar

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  // Add smooth scrolling to CTA button
  if (ctaButton) {
    ctaButton.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  }

  // Navbar background opacity on scroll
  const navbar = document.querySelector(".navbar")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(0, 0, 0, 0.98)"
    } else {
      navbar.style.background = "rgba(0, 0, 0, 0.95)"
    }
  })

  // Add scroll-triggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"

        // Trigger specific animations
        if (entry.target.classList.contains("hero-stats")) {
          animateCounters()
        }
        if (entry.target.classList.contains("skills-container")) {
          animateSkills()
        }
      }
    })
  }, observerOptions)

  new ParticleSystem()

  const animateCounters = () => {
    const counters = document.querySelectorAll(".stat-number")
    counters.forEach((counter) => {
      const target = Number.parseInt(counter.getAttribute("data-target"))
      const increment = target / 100
      let current = 0

      const updateCounter = () => {
        if (current < target) {
          current += increment
          counter.textContent = Math.ceil(current)
          setTimeout(updateCounter, 20)
        } else {
          counter.textContent = target
        }
      }

      updateCounter()
    })
  }

  const animateSkills = () => {
    const skillBars = document.querySelectorAll(".skill-progress")
    skillBars.forEach((bar, index) => {
      setTimeout(() => {
        const width = bar.getAttribute("data-width")
        bar.style.width = width
      }, index * 200)
    })
  }

  const heroStats = document.querySelector(".hero-stats")
  const skillsContainer = document.querySelector(".skills-container")

  if (heroStats) {
    heroStats.style.opacity = "0"
    heroStats.style.transform = "translateY(30px)"
    heroStats.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(heroStats)
  }

  if (skillsContainer) {
    skillsContainer.style.opacity = "0"
    skillsContainer.style.transform = "translateY(30px)"
    skillsContainer.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(skillsContainer)
  }

  // Observe project cards for scroll animations
  const projectCards = document.querySelectorAll(".project-card")
  projectCards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
    observer.observe(card)

    // Add tilt effect
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)"
    })
  })

  // Add hover effect for project buttons
  const projectButtons = document.querySelectorAll(".project-button")
  projectButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px) scale(1.05)"
    })

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(-2px) scale(1)"
    })
  })

  // Add click effect for contact links
  const contactLinks = document.querySelectorAll(".contact-link")
  contactLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Create ripple effect
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.classList.add("ripple")

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })

  const typingText = document.querySelector(".typing-text")
  if (typingText) {
    const text = typingText.textContent
    typingText.textContent = ""
    let i = 0

    const typeWriter = () => {
      if (i < text.length) {
        typingText.textContent += text.charAt(i)
        i++
        setTimeout(typeWriter, 100)
      }
    }

    setTimeout(typeWriter, 1000)
  }
})

// Add CSS for ripple effect
const style = document.createElement("style")
style.textContent = `
    .contact-link {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 102, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById("particles-canvas")
    this.ctx = this.canvas.getContext("2d")
    this.particles = []
    this.mouse = { x: 0, y: 0 }

    this.resize()
    this.init()
    this.animate()

    window.addEventListener("resize", () => this.resize())
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
    })
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  init() {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx
      particle.y += particle.vy

      // Mouse interaction
      const dx = this.mouse.x - particle.x
      const dy = this.mouse.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 100) {
        particle.vx += dx * 0.0001
        particle.vy += dy * 0.0001
      }

      // Boundary check
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1

      // Draw particle
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fillStyle = `rgba(0, 102, 255, ${particle.opacity})`
      this.ctx.fill()

      // Draw connections
      this.particles.forEach((otherParticle, otherIndex) => {
        if (index !== otherIndex) {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            this.ctx.beginPath()
            this.ctx.moveTo(particle.x, particle.y)
            this.ctx.lineTo(otherParticle.x, otherParticle.y)
            this.ctx.strokeStyle = `rgba(0, 255, 136, ${0.1 * (1 - distance / 100)})`
            this.ctx.stroke()
          }
        }
      })
    })

    requestAnimationFrame(() => this.animate())
  }
}
