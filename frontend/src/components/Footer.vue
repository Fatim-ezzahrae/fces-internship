<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-left">
          <div class="logo">
            <p>Fces</p>
          </div>
          <nav class="footer-nav">
            <router-link :to="{ name: 'Contact' }">Contactez-nous</router-link>
            <router-link :to="{ name: 'Services' }">Nos Services</router-link>
            <router-link :to="{ name: 'Projects' }">Nos Projets</router-link>
            <router-link :to="{ name: 'Products' }">Nos Produits</router-link>
          </nav>
        </div>
        
        <div class="footer-right">
          <div class="footer-cta">
            <h4>Froid, climatisation et énérgie solaire</h4>
            <WhatsAppButton class="footer-whatsapp" />
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-links">
          <a href="#">Politique de confidentialité</a>
          <a href="#">Conditions de service</a>
          <a href="#">Paramètres des cookies</a>
        </div>
        <p class="copyright">© 2025 Fces. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import WhatsAppButton from '@/components/WhatsappButton.vue' 
</script>

<style scoped>
.footer {
  background: #111;
  color: #fff;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  padding: 60px 0 30px;
  font-family: 'Inter', sans-serif;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
  border-bottom: 1px solid #333;
  padding-bottom: 40px;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-width: 250px;
}

/* Logo styles */
.logo p {
  font-family: "Marck Script", cursive;
  font-size: 2.9rem;
  font-weight: 500;
  color: #fff;
  letter-spacing: -0.8px;
  margin: 0;
  padding: 0;
  position: relative;
  display: inline-block;
}

.logo p::after {
  content: '•';
  font-size: 2.5rem;
  position: absolute;
  bottom: -0.34rem;
  right: -0.6rem;
  color: #7A8B74;
  opacity: 0.8;
}

/* Nav placed beneath the logo */
.footer-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  margin-top: 10px;
}

.footer-nav a {
  color: #fff;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
  padding: 5px 0;
}

.footer-nav a:hover {
  color: #7A8B74;
  text-decoration: none;
}

.footer-cta {
  flex: 1;
  min-width: 250px;
  display: flex;
  align-items: flex-end;
}

.footer-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.footer-cta {
  flex: 1;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;
}

.footer-whatsapp {
  margin-top: 15px;
  background-color: transparent;
  border: 2px solid #25d366;
  color: #25d366;
  transition: all 0.3s ease;
}

.footer-whatsapp:hover {
  background-color: #25d366;
  box-shadow: 0 0 15px rgba(37, 211, 102, 0.2);
  color: white;
}

.footer-whatsapp .icon {
  color: inherit;
}

.footer-bottom {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #aaa;
  gap: 15px;
}

.footer-links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.footer-links a {
  color: #aaa;
  text-decoration: none;
  transition: color 0.2s ease;
  padding: 5px 0;
}

.footer-links a:hover {
  color: #7A8B74;
}

.copyright {
  margin: 0;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .footer-right {
    width: 100%;
  }
  
  .footer-cta {
    align-items: flex-start;
    gap: 15px;
  }
  
  .footer-whatsapp {
    margin-top: 10px;
  }

    .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    margin-top: 30px;
  }

  .footer-links {
    gap: 15px;
  }
}

/* WhatsApp button specific mobile styles */
@media (max-width: 480px) {
  .footer-whatsapp {
    width: 100%;
    justify-content: center;
  }
}
</style>