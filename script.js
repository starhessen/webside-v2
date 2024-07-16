
  document.getElementById("cards").onmousemove = e => {
    for(const card of document.getElementsByClassName("card")) {
      const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
  
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };
  }

  const wrapper = document.getElementById("tiles");

  let columns = 0,
      rows = 0,
      toggled = false;
  
  const toggle = () => {
    toggled = !toggled;
    
    document.body.classList.toggle("toggled");
  }
  
  const handleOnClick = index => {
    toggle();
    
    anime({
      targets: ".tile",
      opacity: toggled ? 0 : 1,
      delay: anime.stagger(50, {
        grid: [columns, rows],
        from: index
      })
    });
  }
  
  const createTile = index => {
    const tile = document.createElement("div");
    
    tile.classList.add("tile");
    
    tile.style.opacity = toggled ? 0 : 1;
    
    tile.onclick = e => handleOnClick(index);
    
    return tile;
  }
  
  const createTiles = quantity => {
    Array.from(Array(quantity)).map((tile, index) => {
      wrapper.appendChild(createTile(index));
    });
  }
  
  const createGrid = () => {
    wrapper.innerHTML = "";
    
    const size = document.body.clientWidth > 800 ? 100 : 50;
    
    columns = Math.floor(document.body.clientWidth / size);
    rows = Math.floor(document.body.clientHeight / size);
    
    wrapper.style.setProperty("--columns", columns);
    wrapper.style.setProperty("--rows", rows);
    
    createTiles(columns * rows);
  }
  
  createGrid();
  
  window.onresize = () => createGrid();
  
  console.clear();

  const circleElement = document.querySelector('.circle');
  const mouse = { x: 0, y: 0 };
  const previousMouse = { x: 0, y: 0 }
  const circle = { x: 0, y: 0 };
  let currentScale = 0;
  let currentAngle = 0;

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  const speed = 0.17;

  const tick = () => {
    circle.x += (mouse.x - circle.x) * speed;
    circle.y += (mouse.y - circle.y) * speed;
    const translateTransform = `translate(${circle.x}px, ${circle.y}px)`;

    const deltaMouseX = mouse.x - previousMouse.x;
    const deltaMouseY = mouse.y - previousMouse.y;
    previousMouse.x = mouse.x;
    previousMouse.y = mouse.y;
    const mouseVelocity = Math.min(Math.sqrt(deltaMouseX**2 + deltaMouseY**2) * 4, 150); 
    const scaleValue = (mouseVelocity / 150) * 0.5;
    currentScale += (scaleValue - currentScale) * speed;
    const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;

    const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;
    if (mouseVelocity > 20) {
      currentAngle = angle;
    }
    const rotateTransform = `rotate(${currentAngle}deg)`;

    circleElement.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;

    window.requestAnimationFrame(tick);
  }

  tick();

  const scrollers = document.querySelectorAll(".scroller");

  // If a user hasn't opted in for recuded motion, then we add the animation
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addAnimation();
  }

  function addAnimation() {
    scrollers.forEach((scroller) => {
      // add data-animated="true" to every `.scroller` on the page
      scroller.setAttribute("data-animated", true);

      // Make an array from the elements within `.scroller-inner`
      const scrollerInner = scroller.querySelector(".scroller__inner");
      const scrollerContent = Array.from(scrollerInner.children);

      // For each item in the array, clone it
      // add aria-hidden to it
      // add it into the `.scroller-inner`
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        duplicatedItem.setAttribute("aria-hidden", true);
        scrollerInner.appendChild(duplicatedItem);
      });
    });
  }
