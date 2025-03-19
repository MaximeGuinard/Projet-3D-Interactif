import React, { useEffect, useRef } from 'react';
import 'aframe';
import 'aframe-extras';
import 'aframe-physics-system';

function App() {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Only register components if they haven't been registered yet
    if (!AFRAME.components.shooter) {
      AFRAME.registerComponent('shooter', {
        init: function() {
          this.el.addEventListener('click', () => {
            const bullet = document.createElement('a-sphere');
            bullet.setAttribute('position', this.el.getAttribute('position'));
            bullet.setAttribute('radius', '0.1');
            bullet.setAttribute('color', '#ff0000');
            bullet.setAttribute('dynamic-body', '');
            bullet.setAttribute('velocity', '0 0 -20');
            this.el.sceneEl.appendChild(bullet);

            // Remove bullet after 1 second
            setTimeout(() => {
              if (bullet.parentNode) {
                bullet.parentNode.removeChild(bullet);
              }
            }, 1000);
          });
        },
        remove: function() {
          // Cleanup event listeners if needed
          this.el.removeEventListener('click');
        }
      });
    }

    if (!AFRAME.components.target) {
      AFRAME.registerComponent('target', {
        init: function() {
          const handleCollide = () => {
            this.el.setAttribute('color', '#ff0000');
            setTimeout(() => {
              if (this.el && this.el.setAttribute) {
                this.el.setAttribute('color', '#ffffff');
              }
            }, 500);
          };
          
          this.el.addEventListener('collide', handleCollide);
          
          // Store the handler for cleanup
          this.collideHandler = handleCollide;
        },
        remove: function() {
          if (this.collideHandler) {
            this.el.removeEventListener('collide', this.collideHandler);
          }
        }
      });
    }
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <a-scene physics="driver: cannon">
        {/* Luxurious 360° Environment */}
        <a-sky 
          src="https://images.unsplash.com/photo-1505544124425-336eaae0e37c?q=80&w=4000&auto=format&fit=crop"
          rotation="0 -90 0">
        </a-sky>

        {/* Elegant Floor with Reflection */}
        <a-plane 
          position="0 0 0" 
          rotation="-90 0 0" 
          width="50" 
          height="50" 
          material="metalness: 0.8; roughness: 0.2; color: #1a1a1a"
          static-body>
        </a-plane>

        {/* Atmospheric Lighting */}
        <a-light type="ambient" color="#ffffff" intensity="0.5"></a-light>
        <a-light type="directional" color="#ffdddd" intensity="1" position="-1 1 1"></a-light>
        <a-light type="point" color="#ff9999" intensity="0.8" position="2 4 -2"></a-light>

        {/* Perfume Bottle Centerpiece */}
        <a-box
          position="0 2 -5"
          width="1"
          height="2"
          depth="1"
          material="metalness: 0.9; roughness: 0.1; color: #gold"
          animation="property: rotation; to: 0 360 0; dur: 10000; easing: linear; loop: true">
        </a-box>

        {/* Floating Brand Name */}
        <a-text
          value="MAXIME"
          position="-1 4 -5"
          color="#ffffff"
          scale="2 2 2"
          animation="property: position; to: -1 4.2 -5; dur: 2000; dir: alternate; easing: easeInOutQuad; loop: true">
        </a-text>

        {/* Game Targets */}
        {[...Array(5)].map((_, i) => (
          <a-box
            key={i}
            position={`${-4 + i * 2} 1.5 -8`}
            width="0.5"
            height="0.5"
            depth="0.5"
            color="#ffffff"
            target=""
            static-body>
          </a-box>
        ))}

        {/* Player Weapon */}
        <a-entity
          position="0 1.6 0"
          shooter="">
          <a-camera look-controls wasd-controls>
            <a-entity
              position="0 0 -1"
              geometry="primitive: box; width: 0.02; height: 0.02; depth: 0.02"
              material="color: #ff0000"
              cursor="fuse: false">
            </a-entity>
          </a-camera>
        </a-entity>

        {/* Particle Effects */}
        <a-entity
          position="0 3 -5"
          particle-system="preset: dust; particleCount: 100; color: #ffdddd">
        </a-entity>
      </a-scene>
    </div>
  );
}

export default App;