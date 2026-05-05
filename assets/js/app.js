(function() {
  "use strict";
  
  gsap.registerPlugin(ScrollTrigger);
  
  window.App = {};
  
  App.config = {
    cursorFollower: {
      enabled: true,
      disableBreakpoint: '992', // cursor will be disabled on this device width
    },
  }
  
  App.html = document.querySelector('html');
  App.body = document.querySelector('body');
  App.SMcontroller = new ScrollMagic.Controller();
  
  window.onload = function () {
    document.fonts.ready.then(function () {
      initialReveal()
    })
  }
  
  function initialReveal() {
    const preloader = document.querySelector('.js-preloader')
  
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('-is-hidden')
        initComponents()
        RevealAnim.init()
      }, 600)
    } else {
      RevealAnim.init()
      initComponents()
    }
  }
  
  // Reloads all scripts when navigating through pages
  function initComponents() {
    sectionSlider()
    testimonialsSlider_1()
    marquee()
  
    menuEvents()
    headerSticky()
    dbSidebarToggle()
    Header.init()
  
    Tabs.init()
    Accordion.init()
    lazyLoading()
    parallaxInit()
    mapCard()
    galleryInit()
    Cursor.init()
  
    heroSlider7()
    heroSlider9()
    heroSlider10()
  
    Select.init(".js-select")
    priceRangeSliderInit()
    requestForm()
  
    splitText()
    parallaxIt()
    hero1Reveal()
    toTopButton()
    tabsSlider()
    hero5Reveal()
    testimonialsSlider1()
    testimonialsSlider_2()
  
    lineChart()
  
    dropdown()
    countChange()
  
    Events.init()
  
    pinOnScroll()
  
    // calendarSlider()
    // calendarInteraction()
    initTripRangePicker()
    document.querySelector('#planning').style.display = 'block';
    Calendar.init()
    initTippy()
    calendarInteraction()
  
    selectControl()
    liveSearch()
  
    //
      // your custom plugins init here
    //
  }
  
  function liveSearch() {
    const targets = document.querySelectorAll('.js-liverSearch')
    if (!targets) return
  
    const data = [
      { icon: "icon-pin", title: "Phuket", text: "Thailand, Asia" },
      { icon: "icon-price-tag", title: "London Day Trips", text: "England" },
      { icon: "icon-flag", title: "Europe", text: "Country" },
      { image: "img/misc/icon.png", title: "Centipede Tour - Guided Arizona Desert Tour by ATV", text: "Country" },
      { icon: "icon-pin", title: "Istanbul", text: "Turkey" },
      { icon: "icon-pin", title: "Berlin", text: "Germany, Europe" },
      { icon: "icon-pin", title: "London", text: "England, Europe" },
    ]
  
    targets.forEach(el => {
      const search = el.querySelector('.js-search')
      const results = el.querySelector('.js-results')
      let searchTerm = ''
  
      results.querySelectorAll('.js-search-option').forEach(option => {
        const title = option.querySelector('.js-search-option-target').innerHTML
        option.addEventListener('click', () => search.value = title)
      })
  
      search.addEventListener('input', (event) => {
        searchTerm = event.target.value.toLowerCase()
        showList(searchTerm, results)
  
        results.querySelectorAll('.js-search-option').forEach(option => {
          const title = option.querySelector('.js-search-option-target').innerHTML
          option.addEventListener('click', () => search.value = title)
        })
      })
    })
  
    const showList = (searchTerm, resultsEl) => {
      resultsEl.innerHTML = '';
  
      data
        .filter((item) => item.title.toLowerCase().includes(searchTerm))
        .forEach((e) => {
          const div = document.createElement('div')
  
          if (e.image) {
            div.innerHTML = `
              <button class="headerSearchRecent__item js-search-option" data-x-click="headerSearch">
                <div class="size-50 bg-white rounded-12 border-1 flex-center">
                  <img src="${e.image}" alt="image" class="rounded-12">
                </div>
                <div class="ml-10">
                  <div class="text-overflow fw-500 js-search-option-target">${e.title}</div>
                  <div class="lh-14 text-14 text-light-2">${e.text}</div>
                </div>
              </button>
            `
          } else {
            div.innerHTML = `
              <button class="headerSearchRecent__item js-search-option" data-x-click="headerSearch">
                <div class="size-50 bg-white rounded-12 border-1 flex-center">
                  <i class="${e.icon} text-20"></i>
                </div>
                <div class="ml-10">
                  <div class="fw-500 js-search-option-target">${e.title}</div>
                  <div class="lh-14 text-14 text-light-2">${e.text}</div>
                </div>
              </button>
            `
          }
  
          resultsEl.appendChild(div)
        })
    }
  }
  
  function selectControl() {
    const targets = document.querySelectorAll('.js-select-control')
    if (!targets) return
  
    targets.forEach(el => {
      const chosen = el.querySelector('.js-select-control-chosen')
      const buttons = el.querySelectorAll('.js-select-control-button')
  
      buttons.forEach(button => {
        const choice = button.querySelector('.js-select-control-choice')
  
        button.addEventListener('click', () => {
          if (el.querySelector('.-is-button-active')) {
            el.querySelector('.-is-button-active').classList.remove('-is-button-active')
          }
  
          closeAllDropdowns()
  
          button.classList.add('-is-button-active')
          chosen.innerHTML = choice.innerHTML

          const chosenId = chosen ? chosen.id : ''
          if (chosenId === 'year') {
            initTripRangePicker()
          }

          if (chosenId === 'year' || chosenId === 'nbOfDays' || chosenId === 'remotely') {
            Calendar.init()
            initTippy()
          }
        })
      })
    })
  }

  function getPlannerYearElement() {
    return document.querySelector('[data-x-click="years"] #year')
  }

  function getSelectedPlannerYear() {
    const yearElement = getPlannerYearElement()
    const parsed = parseInt(yearElement && yearElement.textContent ? yearElement.textContent.trim() : '', 10)
    return Number.isNaN(parsed) ? new Date().getFullYear() : parsed
  }

  function setupDynamicYearOptions() {
    const yearElement = getPlannerYearElement()
    const yearList = document.querySelector('[data-x="years"] .searchFormItemDropdown__list')
    if (!yearElement || !yearList) return

    const baseYear = new Date().getFullYear()
    const years = [baseYear, baseYear + 1]

    yearList.innerHTML = years.map((year, index) => `
      <div class="searchFormItemDropdown__item">
        <button class="js-select-control-button ${index === 0 ? '-is-button-active' : ''}">
          <span class="js-select-control-choice">${year}</span>
        </button>
      </div>
    `).join('')

    yearElement.textContent = String(baseYear)
  }

  setupDynamicYearOptions()

  const footerYear = document.getElementById('footer-year')
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear())
  }

  function initTripRangePicker() {
    const rangeInput = document.getElementById('tripRange')
    const startInput = document.getElementById('tripStart')
    const endInput = document.getElementById('tripEnd')
    const clearButton = document.getElementById('tripRangeClear')

    if (!rangeInput || !startInput || !endInput) return

    const selectedYear = getSelectedPlannerYear()
    const minDate = `${selectedYear}-01-01`
    const maxDate = `${selectedYear}-12-31`

    if (startInput.value && (startInput.value < minDate || startInput.value > maxDate)) {
      startInput.value = ''
    }

    if (endInput.value && (endInput.value < minDate || endInput.value > maxDate)) {
      endInput.value = ''
    }

    const syncButton = () => {
      if (!clearButton) return
      clearButton.hidden = !(startInput.value || endInput.value)
    }

    const syncHiddenDates = (selectedDates) => {
      startInput.value = ''
      endInput.value = ''

      if (selectedDates[0]) {
        startInput.value = flatpickr.formatDate(selectedDates[0], 'Y-m-d')
      }

      if (selectedDates[1]) {
        endInput.value = flatpickr.formatDate(selectedDates[1], 'Y-m-d')
      }

      syncButton()
    }

    const applyRangeSelection = (selectedDates, forceRebuild = false) => {
      syncHiddenDates(selectedDates)

      const hasFullRange = selectedDates.length === 2
      const wasCleared = selectedDates.length === 0

      if (forceRebuild || hasFullRange || wasCleared) {
        Calendar.init()
        initTippy()
      }
    }

    if (rangeInput._flatpickr) {
      rangeInput._flatpickr.destroy()
    }

    if (typeof flatpickr === 'function') {
      const picker = flatpickr(rangeInput, {
        mode: 'range',
        dateFormat: 'Y-m-d',
        minDate,
        maxDate,
        disableMobile: true,
        static: true,
        clickOpens: true,
        onChange: function(selectedDates) {
          applyRangeSelection(selectedDates)
        },
        onClose: function(selectedDates) {
          applyRangeSelection(selectedDates, true)
        },
      })

      if (startInput.value && endInput.value) {
        picker.setDate([startInput.value, endInput.value], false, 'Y-m-d')
      }

      if (clearButton) {
        clearButton.addEventListener('click', () => {
          picker.clear()
          startInput.value = ''
          endInput.value = ''
          syncButton()
          Calendar.init()
          initTippy()
        })
      }
    }

    syncButton()
  }
  
  function dropdown() {
    const targets = document.querySelectorAll('.js-dropdown')
    if (!targets.length) return
  
    targets.forEach((target) => {
      const title = target.querySelector('.js-title')
      const button = target.querySelector('.js-button')
      const menuItems = target.querySelectorAll('.js-menu-items > *')
  
      if (button) {
        button.addEventListener('click', () => {
          closeAllDropdowns()
          target.classList.toggle('is-active')
        })
      }
  
      menuItems.forEach((el) => {
        el.addEventListener('click', () => {
          if (!target.classList.contains('js-dont-close')) {
            target.classList.toggle('is-active')
            title.innerHTML = el.innerHTML
          }
          target.setAttribute("data-main-value", el.getAttribute('data-value'))
        })
      })
    })
  }
  
  function heroSlider7() {
    const target = document.querySelector('.js-hero-type-7 .js-slider')
  
    new Swiper(target, {
      speed: 600,
      parallax: true,
      lazy: true,
      spaceBetween: 0,
      slidesPerView: 1,
  
      lazy: {
        loadPrevNext: true,
      },
      navigation: {
        prevEl: ".js-prev",
        nextEl: ".js-next",
      },
    })
  }
  
  function heroSlider9() {
    const target = document.querySelector('.js-hero-type-9 .js-slider')
  
    if (!target) return
  
    new Swiper(target, {
      speed: 600,
      parallax: true,
      lazy: true,
      spaceBetween: 0,
      slidesPerView: 1,
      lazy: {
        loadPrevNext: true,
      },
      pagination: {
        el: '.js-nav',
        clickable: true,
        renderBullet: function (index, className) {
          return `<div class="${className}">0${index + 1}</div>`
        },
      },
      navigation: {
        prevEl: ".js-prev",
        nextEl: ".js-next",
      },
    })
  }
  
  function heroSlider10() {
    const target = document.querySelector('.js-hero-type-10 .js-slider')
  
    new Swiper(target, {
      direction: "vertical",
      speed: 600,
      parallax: true,
      lazy: true,
      spaceBetween: 0,
      slidesPerView: 1,
      mousewheel: {
        invert: false,
      },
      lazy: {
        loadPrevNext: true,
      },
      pagination: {
        el: '.js-pagination',
        bulletClass: 'pagination__item',
        bulletActiveClass: 'is-active',
        bulletElement: 'div',
        clickable: true
      }
    })
  }
  
  function mapCard() {
    const targets = document.querySelectorAll('.js-mapPlaces')
    
    targets.forEach((target) => {
      const cards = target.querySelectorAll('[data-map-card]')
      const buttons = target.querySelectorAll(`[data-map-place]`)
  
      cards.forEach((el) => {
        const attrVal = el.getAttribute('data-map-card')
        const button = target.querySelector(`[data-map-place="${attrVal}"]`)
  
        el.addEventListener('click', (e) => {
          cards.forEach((el) => el.classList.remove('isCardActive'))
          buttons.forEach((el) => el.classList.remove('isActive'))
  
          if (!el.classList.contains('isCardActive')) {
            button.classList.toggle('isActive')
            el.classList.add('isCardActive')
          }
        })
      })
    })
  }
  
  function galleryInit() {
    GLightbox({
      selector: '.js-gallery',
      touchNavigation: true,
      loop: false,
      autoplayVideos: true,
    });
  }
  
  function priceRangeSliderInit() {
    const targets = document.querySelectorAll('.js-price-rangeSlider')
  
    targets.forEach(el => {
      const slider = el.querySelector('.js-slider')
  
      noUiSlider.create(slider, {
        start: [20, 70000],
        step: 1,
        connect: true,
        range: {
          'min': 0,
          'max': 100000
        },
        format: {
          to: function (value) {
            return "$" + value.toFixed(0)
          },
    
          from: function (value) {
            return value
          }
        }
      })
    
      const snapValues = [
        el.querySelector('.js-lower'),
        el.querySelector('.js-upper')
      ]
    
      slider.noUiSlider.on('update', function (values, handle) {
        snapValues[handle].innerHTML = values[handle];
      })
    })
  }
  
  function requestForm() {
    const buttons = document.querySelectorAll('.js-toggle-requestForm')
    const form = document.querySelector('.js-requestForm')
  
    if (!buttons || !form) return
  
    buttons.forEach((el) => {
      el.addEventListener('click', () => form.classList.toggle('is-active'))
    })
  }
  
  function splitText() {
    splt({
      target: ".js-splt"
    })
  }
  
  function parallaxIt() {
    const target = document.querySelectorAll('.js-mouse-move-container')
  
    target.forEach(container => {
      const $this = container
      const targets = container.querySelectorAll('.js-mouse-move')
      
      targets.forEach(el => {
        const movement = el.getAttribute('data-move')
  
        document.addEventListener('mousemove', (e) => {
          const relX = e.pageX - $this.offsetLeft
          const relY = e.pageY - $this.offsetTop
        
          gsap.to(el, {
            x: (relX - $this.offsetWidth / 2) / $this.offsetWidth * -movement,
            duration: 0.4,
          })
        })
      })
    })
  }
  
  function hero1Reveal() {
    const hero = document.querySelector('.js-hero-type-1')
    if (!hero) return
  
    const title = hero.querySelectorAll('.js-title > .char')
    const bg = hero.querySelector('.js-bg')
    const image = hero.querySelector('.js-image')
  
    gsap.timeline()
      .fromTo(title, {
        opacity: 0,
        y: "-100%",
        rotate: "12deg",
      }, {
        rotate: "0",
        y: "0%",
        opacity: 1,
        duration: 0.25,
        delay: 1.0,
        stagger: 0.1,
      })
      .fromTo(image, {
        opacity: 0,
        y: "32px",
      }, {
        y: "0px",
        opacity: 1,
        duration: 0.5,
      })
  }
  
  function hero5Reveal() {
    const hero = document.querySelector('.js-hero-type-5')
    if (!hero) return
  
    const lines = hero.querySelector('.js-lines')
    const icon = hero.querySelector('.js-icon')
    const image = hero.querySelector('.js-image')
    const subtitle = hero.querySelectorAll('.js-subtitle > *')
    const title = hero.querySelector('.js-title')
    const text = hero.querySelector('.js-text')
    const button = hero.querySelector('.js-button')
  
    gsap.timeline()
      .fromTo(lines, {
        opacity: 0,
        scale: 0.95,
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        delay: 0.5,
      })
      .fromTo(icon, {
        opacity: 0,
        scale: 0.95,
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        delay: 0.1,
      })
      .fromTo(image, {
        opacity: 0,
        x: "32px",
      }, {
        x: "0px",
        opacity: 1,
        duration: 0.5,
        delay: 0.1,
      })
  
      .fromTo(subtitle, {
        opacity: 0,
        scale: 0.95,
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.5,
        delay: 0.2,
      })
      .fromTo([title, text, button], {
        opacity: 0,
        x: "20px",
      }, {
        x: "0px",
        opacity: 1,
        duration: 0.5,
        stagger: 0.5,
      })
  }
  
  function toTopButton() {
    const button = document.querySelector('.js-top-button')
    if (!button) return
  
    const pageContentHeight = document.querySelector('main').offsetHeight
  
    new ScrollMagic.Scene({ duration: pageContentHeight - 1600, })
      .setClassToggle(button, 'is-hidden')
      .addTo(App.SMcontroller)
  
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }
  
  function tabsSlider() {
    const slider = document.querySelector('.js-tabsSlider')
  
    if (!slider) return
  
    new Swiper(slider, {
      speed: 400,
      slidesPerView: 1,
      spaceBetween: 0,
      // effect: "fade",
      navigation: {
        prevEl: '.js-tabsSlider-prev',
        nextEl: '.js-tabsSlider-next',
      },
      pagination: {
        el: document.querySelector('.js-tabsSlider-pagination'),
        clickable: true,
        renderBullet: function (index, className) {
          return `<div class="${className}">VILLA STYLE ${index + 1}</div>`
        },
      }
    })
  }
  
  function testimonialsSlider1() {
    const slider = document.querySelector('.js-section-slider-testimonials')
    if (!slider) return
  
    const images = document.querySelector('.js-section-slider-testimonials-images')
  
    const swiper = new Swiper(slider, {
      speed: 400,
      slidesPerView: 1,
      spaceBetween: 0,
      navigation: {
        prevEl: '.js-section-slider-testimonials-prev',
        nextEl: '.js-section-slider-testimonials-next',
      },
    })
  
    swiper.on('slideChange', function () {
      console.log(swiper.realIndex)
      images.style.transform = `translateX(${swiper.realIndex * -100}%)`
    })
  }
  
  function lineChart() {
    const ctx = document.getElementById('lineChart');
    if (!ctx) return;
  
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          'Jan', 'Feb', 'Marc', 'April', 'May', 'Jun', 'July', 'Agust', 'Sept', 'Oct', 'Now', 'Dec',
        ],
        datasets: [{
          label: '#',
          data: [148, 100, 205, 110, 165, 145, 180, 156, 148, 220, 180, 245],
          tension: 0.4,
          backgroundColor: '#336CFB',
          borderColor: '#336CFB',
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            min: 0,
            max: 300,
            ticks: {
              stepSize: 50
            }
          }
        },
      },
    })
  }
  
  function countChange() {
    const counters = document.querySelectorAll('.js-counter')
    if (!counters) return
  
    counters.forEach(el => {
      const count = el.querySelector('.js-count')
      const buttonDown = el.querySelector('.js-down')
      const buttonUp = el.querySelector('.js-up')
  
      buttonDown.addEventListener('click', () => {
        if (count.innerHTML != 0) {
          count.innerHTML = parseInt(count.innerHTML) - 1
        }
      })
  
      buttonUp.addEventListener('click', () => {
        count.innerHTML = parseInt(count.innerHTML) + 1
      })
    })
  }
  
  function pinOnScroll() {
    const target = document.querySelectorAll('.js-pin-container');
    if (!target) return;
  
    target.forEach(el => {
      const sceneDuration = el.offsetHeight;
      const sceneOffset = el.querySelector('.js-pin-content').offsetHeight + 90;
  
      const scene = new ScrollMagic.Scene({
        duration: sceneDuration - sceneOffset,
        offset: sceneOffset,
        triggerElement: el,
        triggerHook: "onEnter",
      })
      .setPin(".js-pin-content")
      .addTo(App.SMcontroller)
  
      let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  
      if (width < 992) {
        scene.duration('1px')
        scene.refresh()
      } else {
        scene.duration(sceneDuration - sceneOffset)
        scene.refresh()
      }
  
      window.addEventListener('resize', () => {
        let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  
        if (width < 992) {
          scene.duration('1px');
          scene.refresh();
        } else {
          scene.duration(sceneDuration - sceneOffset);
          scene.refresh();
        }
      })
    });
  }
  
  function headerSticky() {
    const target = document.querySelector(".js-header")
    if (!target) return
  
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        target.classList.add('-is-sticky')
      } else {
        target.classList.remove('-is-sticky')
      }
    })
  }
  
  function dbSidebarToggle() {
    const target = document.querySelector(".js-toggle-db-sidebar")
    if (!target) return
  
    const dashboard = document.querySelector(".js-dashboard")
  
    if (window.innerWidth < 575) dashboard.classList.remove("-is-sidebar-visible")
  
    target.addEventListener('click', () => dashboard.classList.toggle("-is-sidebar-visible"))
  }
  
  function menuEvents() {
    let isMenuOpen = false
    const menuButtons = document.querySelectorAll('.js-menu-button')
  
    menuButtons.forEach((el) => {
      el.addEventListener('click', (e) => {
        if (!isMenuOpen) {
          menuOpen()
          isMenuOpen = true
        } else {
          menuClose()
          isMenuOpen = false
        }
      })
    })
  }
  
  function menuOpen() {
    const menu = document.querySelector('.js-menu')
    const header = document.querySelector('.js-header')
  
    gsap.timeline()
      .to(menu, {
        opacity: 1,
        onStart: () => {
          menu.classList.add("-is-active")
          document.body.classList.add("overflow-hidden")
          header.classList.add("-dark")
        }
      })
  }
  
  function menuClose() {
    const menu = document.querySelector('.js-menu')
    const header = document.querySelector('.js-header')
  
    gsap.timeline()
      .to(menu, {
        opacity: 0,
        onStart: () => {
          menu.classList.remove("-is-active")
          document.body.classList.remove("overflow-hidden")
          header.classList.remove("-dark")
        }
      })
  }
  
  
  const Header = (function() {
    let navList;
    let navBtnListBack;
    let menuDeepLevel;
    let timeline = gsap.timeline();
  
    function updateVars() {
      navList = document.querySelector('.js-navList');
      navBtnListBack = document.querySelectorAll('.js-nav-list-back');
      menuDeepLevel = 0;
    }
    
    function init() {
      updateVars()
      menuListBindEvents()
    }
  
    function deepLevelCheck(level) {
      return level;
    }
  
    function menuListBindEvents() {
      const listItems = document.querySelectorAll('.js-navList .js-has-submenu');
      if (!listItems.length) return;
  
      navBtnListBack.forEach(el => {
        el.addEventListener('click', () => {
          const visibleList = navList.querySelector('ul.-is-active');
          const parentList = visibleList.parentElement.parentElement;
    
          menuDeepLevel--;
          menuListStepAnimate(visibleList, parentList, menuDeepLevel);
        })
      })
  
      listItems.forEach(el => {
        const parentLink = el.querySelector('li > a');
        parentLink.removeAttribute('href');
  
        parentLink.addEventListener('click', () => {
          const parent = el.parentElement;
          const subnavList = el.lastElementChild;
  
          menuDeepLevel++;
          menuListStepAnimate(parent, subnavList, menuDeepLevel, parentLink.innerHTML);
        });
      });
    }
  
    function menuListStepAnimate(hideList, showList, level) {
      let hideListItems = hideList.children;
      hideListItems = Array.from(hideListItems);
      const hideListLinks = hideListItems.map(item => item.querySelector('li > a'));
      
      let showListItems = showList.children;
      showListItems = Array.from(showListItems);
      const showListLinks = showListItems.map(item => item.querySelector('li > a'));
  
      // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
      // if (width < 1199 || document.querySelector('.js-desktopMenu')) {}
  
      timeline
        .clear()
  
      if (!deepLevelCheck(level)) {
        gsap.to(navBtnListBack, {
          ease: "quart.inOut",
          duration: 0.6,
          opacity: 0,
        })
      }
      
      timeline.to(hideListLinks, {
        ease: 'quart.out',
        stagger: -0.04,
        duration: 0.8,
        y: '100%',
        onStart: () => {
          showList.classList.add('-is-active');
        },
        onComplete: () => {
          hideList.classList.remove('-is-active');
        },
      })
  
      if (deepLevelCheck(level)) {
        timeline.to(navBtnListBack, {
          ease: "quart.inOut",
          duration: 0.6,
          y: '0px',
          opacity: 1,
        }, '>-0.5')
      }
  
      timeline.to(showListLinks, {
        ease: 'quart.out',
        stagger: 0.08,
        duration: 0.9,
        y: '0%',
      }, '>-0.6')
    }
  
    function headerSticky() {
      const header = document.querySelector('.js-header');
      if (!header) return;
    
      let classList = ''
    
      if (header.getAttribute('data-add-bg')) {
        classList = header.getAttribute('data-add-bg')
      }
    
      new ScrollMagic.Scene({ offset: '6px', })
        .setClassToggle(header, classList)
        .addTo(App.SMcontroller);
    
      new ScrollMagic.Scene({ offset: '6px', })
        .setClassToggle(header, 'is-sticky')
        .addTo(App.SMcontroller);
    }
  
    return {
      headerSticky: headerSticky,
      init: init,
    }
  })();
  
  function marquee() {
    const targets = document.querySelectorAll('.js-marquee')
  
    if (!targets) return
  
    targets.forEach((el) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          scrub: 1,
          // markers: true,
        }
      })
    
      tl
        .to(".js-first", {duration: 4, xPercent: -80})
        .to(".js-second", {duration: 4, xPercent: 80}, "<")
    })
  }
  
  /*--------------------------------------------------
    08. Section sliders
  ---------------------------------------------------*/
  
  function sectionSlider() {
    const sectionSlider = document.querySelectorAll('.js-section-slider');
    if (!sectionSlider.length) return;
  
    for (let i = 0; i < sectionSlider.length; i++) {
      const el = sectionSlider[i];
  
      let prevNavElement = el.querySelector('.js-prev')
      let nextNavElement = el.querySelector('.js-next')
  
      if (el.getAttribute('data-nav-prev'))
        prevNavElement = document.querySelector(`.${el.getAttribute('data-nav-prev')}`)
      if (el.getAttribute('data-nav-next'))
        nextNavElement = document.querySelector(`.${el.getAttribute('data-nav-next')}`)
      
      let gap = 0;
      let loop = false;
      let centered = false;
      let pagination = false;
      let scrollbar = false;
  
      if (el.getAttribute('data-gap'))    gap = el.getAttribute('data-gap');
      if (el.hasAttribute('data-loop'))   loop = true;
      if (el.hasAttribute('data-center')) centered = true;
  
      if (el.getAttribute('data-pagination')) {
        let paginationElement = document.querySelector(`.${el.getAttribute('data-pagination')}`)
        
        pagination = {
          el: paginationElement,
          bulletClass: 'pagination__item',
          bulletActiveClass: 'is-active',
          bulletElement: 'div',
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + '">' + 0 + (index + 1) + "</span>";
          },
        }
      }
  
      if (el.hasAttribute('data-scrollbar')) {
        scrollbar = {
          el: '.js-scrollbar',
          draggable: true,
        }
      }
     
      const colsArray = el.getAttribute('data-slider-cols').split(' ');
  
      let cols_base = 1;
      let cols_xl = 1;
      let cols_lg = 1;
      let cols_md = 1;
      let cols_sm = 1;
  
      colsArray.forEach(el => {
        if (el.includes('base')) cols_base = el.slice(-1);
        if (el.includes('xl')) cols_xl = el.slice(-1);
        if (el.includes('lg')) cols_lg = el.slice(-1);
        if (el.includes('md')) cols_md = el.slice(-1);
        if (el.includes('sm')) cols_sm = el.slice(-1);
      });
  
      new Swiper(el, {
        speed: 600,
        autoHeight: true,
        
        centeredSlides: centered,
        parallax: true,
        watchSlidesVisibility: true,
        loop: loop,
        loopAdditionalSlides: 1,
        preloadImages: false,
        lazy: true,
        
        scrollbar: scrollbar,
        pagination: pagination,
        spaceBetween: 10,
        
        // width: 330,
        slidesPerView: parseInt(cols_base),
        breakpoints: {
          1199: { slidesPerView: parseInt(cols_xl), width: null, spaceBetween: parseInt(gap), },
          991: { slidesPerView: parseInt(cols_lg), width: null, spaceBetween: parseInt(gap), },
          767:  { slidesPerView: parseInt(cols_md), width: null, spaceBetween: parseInt(gap), },
          574:  { slidesPerView: parseInt(cols_sm), width: null, spaceBetween: parseInt(gap), },
        },
  
        lazy: {
          loadPrevNext: true,
        },
        navigation: {
          prevEl: prevNavElement,
          nextEl: nextNavElement,
        },
      })
    }
  }
  
  function testimonialsSlider_1() {
    new Swiper('.js-testimonials-slider-1', {
      speed: 400,
      slidesPerView: 1,
      spaceBetween: 0,
      effect: "cards",
      lazy: {
        loadPrevNext: true,
      },
      breakpoints: {
        767:  { width: 430 },
      },
      pagination: {
        el: '.js-testimonials-pagination',
        bulletClass: 'pagination__item',
        bulletActiveClass: 'is-active',
        bulletElement: 'div',
        clickable: true
      }
    })
  }
  
  function testimonialsSlider_2() {
    const slider = new Swiper('.js-testimonialsSlider_1', {
      speed: 400,
      slidesPerView: 1,
      lazy: {
        loadPrevNext: true,
      },
    })
  
    const paginationItems = document.querySelectorAll('.js-testimonialsSlider_1-pagination > *')
  
    paginationItems.forEach((el, i) => {
      el.addEventListener('click', () => {
        document
          .querySelector('.js-testimonialsSlider_1-pagination .is-active')
          .classList.remove('is-active')
        el.classList.add('is-active')
        slider.slideTo(i)
      })
    })
  
    slider.on('slideChangeTransitionStart', () => {
      document
        .querySelector('.js-testimonialsSlider_1-pagination .is-active')
        .classList.remove('is-active')
      paginationItems[slider.realIndex].classList.add('is-active')
    })
  }
  
  const Tabs = (function() {
    function init() {
      const targets = document.querySelectorAll(".js-tabs");
      if (!targets) return;
  
      targets.forEach(el => {
        singleTab(el)
      })
    }
  
    function singleTab(target) {
      const controls = target.querySelector('.js-tabs-controls');
      const controlsItems = target.querySelectorAll('.js-tabs-controls .js-tabs-button');
      const content = target.querySelector('.js-tabs-content');
  
      for (let l = 0; l < controlsItems.length; l++) {
        const el = controlsItems[l];
        
        el.addEventListener("click", (e) => {
          const selector = el.getAttribute('data-tab-target');
  
          controls.querySelector('.is-tab-el-active').classList.remove('is-tab-el-active')
          content.querySelector('.is-tab-el-active').classList.remove('is-tab-el-active')
  
          el.classList.add('is-tab-el-active')
          content.querySelector(selector).classList.add('is-tab-el-active')
        });
      }
    }
  
    return {
      init: init,
    }
  })();
  
  const Accordion = (function() {
    function init() {
      const targets = document.querySelectorAll(".js-accordion");
      if (!targets) return;
  
      for (let i = 0; i < targets.length; i++) {
        const items = targets[i].querySelectorAll('.accordion__item');
  
        for (let l = 0; l < items.length; l++) {
          const button = items[l].querySelector('.accordion__button')
          const content = items[l].querySelector('.accordion__content')
          const titleChange = items[l].querySelector('[data-open-change-title]')
          let buttonOrigTitle
          let buttonNewTitle
  
          if (items[l].classList.contains('js-accordion-item-active')) {
            items[l].classList.toggle('is-active')
            content.style.maxHeight = content.scrollHeight + "px"
          }
  
          if (titleChange) {
            buttonOrigTitle = titleChange.innerHTML
            buttonNewTitle = titleChange.getAttribute('data-open-change-title')
          }
          
          button.addEventListener("click", (e) => {
            items[l].classList.toggle('is-active');
  
            if (titleChange) {
              if (items[l].classList.contains('is-active')) {
                titleChange.innerHTML = buttonNewTitle
              } else {
                titleChange.innerHTML = buttonOrigTitle
              }
            }
    
            if (content.style.maxHeight) {
              content.style.maxHeight = null
            } else {
              content.style.maxHeight = content.scrollHeight + "px"
            }
          })
        }
      }
    }
  
    return {
      init: init,
    }
  })();
  
  const ShowMore = (function() {
    function init() {
      const targets = document.querySelectorAll(".js-show-more");
      if (!targets) return;
  
      targets.forEach((el, i) => {
        const button = el.querySelector('.show-more__button')
        const content = el.querySelector('.show-more__content')
        
        button.addEventListener("click", (e) => {
          el.classList.toggle('is-active')
  
          if (content.style.maxHeight) {
            content.style.maxHeight = null
          } else {
            content.style.maxHeight = content.scrollHeight + "px"
          }
        })
      })
    }
  
    return {
      init: init,
    }
  })();
  
  /*--------------------------------------------------
    12. Parallax
  ---------------------------------------------------*/
  
  function parallaxInit() {
    if (!document.querySelector('[data-parallax]')) return;
    const target = document.querySelectorAll('[data-parallax]')
  
    target.forEach(el => {
      jarallax(el, {
        speed: el.getAttribute('data-parallax'),
        imgElement: '[data-parallax-target]',
      })
    })
  }
  
  /*--------------------------------------------------
    06. Elements reveal
  ---------------------------------------------------*/
  
  const RevealAnim = (function() {
    function single() {
      const animationTarget = document.querySelectorAll('[data-anim]');
      if (!animationTarget.length) return;
  
      for (let i = 0; i < animationTarget.length; i++) {
        const el = animationTarget[i];
      
        new ScrollMagic.Scene({
          offset: '350px',
          triggerElement: el,
          triggerHook: "onEnter",
          reverse: false,
        })
        .on('enter', function (event) {
          animateElement(el);
        })
        .addTo(App.SMcontroller)
      }
    }
    
    function container() {
    
      const animationContainer = document.querySelectorAll('[data-anim-wrap]');
    
      if (!animationContainer.length) {
        return;
      }
      
      for (let i = 0; i < animationContainer.length; i++) {
        const el = animationContainer[i];
      
        new ScrollMagic.Scene({
          offset: '350px',
          triggerElement: el,
          triggerHook: "onEnter",
          reverse: false,
        })
        .on('enter', function (event) {
          
          const animChilds = el.querySelectorAll('[data-anim-child]');
          el.classList.add('animated');
          animChilds.forEach(el => animateElement(el));
          
        })
        .addTo(App.SMcontroller)
      }
    
    }
    
  
    function animateElement(target) {
      
      let attrVal;
      let animDelay;
      let attrDelayPart;
    
      if (target.getAttribute('data-anim')) {
        attrVal = target.getAttribute('data-anim');
      } else {
        attrVal = target.getAttribute('data-anim-child');
      }
      
      if (attrVal.includes('delay-')) {
        attrDelayPart = attrVal.split(' ').pop();
        animDelay = attrDelayPart.substr(attrDelayPart.indexOf('-') + 1) / 10;
      }
    
      if (attrVal.includes('counter')) {
        counter(target, animDelay);
      }
      else if (attrVal.includes('line-chart')) {
        lineChart(target, animDelay);
      }
      else if (attrVal.includes('pie-chart')) {
        pieChart(target, animDelay);
      }
      else if (attrVal.includes('split-lines')) {
        splitLines(target, animDelay);
      }
      else {
        target.classList.add('is-in-view');
      }
  
    }
  
    function pieChart(target, animDelay = 0) {
    
      const counterVal = target.getAttribute('data-percent');
      const chartBar = target.querySelector('.js-chart-bar');
      
      if (counterVal < 0) { counterVal = 0;}
      if (counterVal > 100) { counterVal = 100;}
      
      gsap.fromTo(chartBar, {
        drawSVG: `0%`,
      }, {
        delay: 0.3 + animDelay,
        duration: 1.4,
        ease: 'power3.inOut',
        drawSVG: `${counterVal}%`,
    
        onStart: () => {
          chartBar.classList.remove('bar-stroke-hidden');
        }
      });
    
    
      let object = { count: 0 };
      const barPercent = target.querySelector('.js-chart-percent');
    
      gsap.to(object, {
        count: counterVal,
        delay: 0.45 + animDelay,
        duration: 1,
        ease: 'power3.inOut',
        
        onUpdate: function() {
          barPercent.innerHTML = Math.round(object.count) + '%';
        },
      });
    
    }
    
    function lineChart(target, animDelay = 0) {
    
      const counterVal = target.getAttribute('data-percent');
    
      gsap.fromTo(target.querySelector('.js-bar'), {
        scaleX: 0,
      }, {
        delay: 0.45 + animDelay,
        duration: 1,
        ease: 'power3.inOut',
        scaleX: counterVal / 100,
      })
    
    
      let object = { count: 0 };
      const barPercent = target.querySelector('.js-number');
    
      gsap.to(object, {
        count: counterVal,
        delay: 0.45 + animDelay,
        duration: 1,
        ease: 'power3.inOut',
        
        onUpdate: function() {
          barPercent.innerHTML = Math.round(object.count);
        },
      });
    
    }
    
    function counter(target, animDelay = 0) {
    
      const counterVal = target.getAttribute('data-counter');
      const counterAdd = target.getAttribute('data-counter-add');
      const totalDelay = animDelay;
      let symbols = '';
      
      let object = { count: 0 };
      const counterNum = target.querySelector('.js-counter-num');
  
      if (counterAdd) {
        symbols = counterAdd;
      }
    
      gsap.to(object, {
        count: counterVal,
        delay: totalDelay,
        duration: 1.8,
        ease: 'power3.inOut',
        
        onUpdate: function() {
          counterNum.innerHTML = Math.round(object.count) + symbols;
        },
      });
    
    }
  
    function init() {
      single();
      container();
    }
  
    return {
      init: init,
    }
  })();
  
  /*--------------------------------------------------
    11. Lazy loading
  ---------------------------------------------------*/
  
  function lazyLoading() {
    if (!document.querySelector('.js-lazy')) {
      return;
    }
  
    new LazyLoad({
      elements_selector: ".js-lazy",
    });
  }
  
  const Select = (function() {
    function init(selector) {
      document.querySelectorAll(selector).forEach((el) => singleSelect(el))
      document.querySelectorAll('.js-multiple-select').forEach((el) => multipleSelect(el))
    }
  
    function multipleSelect(target) {
      const button = target.querySelector('.js-button')
      const title = button.querySelector('.js-button-title')
      
      button.addEventListener('click', () => {
        let dropdown = target.querySelector('.js-dropdown')
        
        if (dropdown.classList.contains('-is-visible')) {
          dropdown.classList.remove('-is-visible')
        } else {
          closeAlldropdowns()
          dropdown.classList.add('-is-visible')
        }
      })
  
      const dropdown = target.querySelector('.js-dropdown')
      const options = dropdown.querySelectorAll('.js-options > *')
  
      options.forEach((el) => {
        el.addEventListener('click', () => {
          let selectedValues = []
          el.classList.toggle('-is-choosen')
  
          const array = dropdown.querySelectorAll('.-is-choosen .js-target-title')
          array.forEach((el2) => {
            selectedValues.push(el2.innerHTML)
          })
  
          if (!array.length) {
            title.innerHTML = "Default"
            target.setAttribute("data-select-value", "")
          } else {
            title.innerHTML = selectedValues.join(', ')
            target.setAttribute("data-select-value", selectedValues.join(', '))
          }
  
          const checkbox = el.querySelector('input')
          checkbox.checked = !checkbox.checked
        })
      })
    }
  
    function singleSelect(target) {
      const button = target.querySelector('.js-button')
      const title = button.querySelector('.js-button-title')
      
      if (target.classList.contains('js-liveSearch')) {
        liveSearch(target)
      }
  
      button.addEventListener('click', () => {
        let dropdown = target.querySelector('.js-dropdown')
        
        if (dropdown.classList.contains('-is-visible')) {
          dropdown.classList.remove('-is-visible')
        } else {
          closeAlldropdowns()
          dropdown.classList.add('-is-visible')
        }
        
        if (target.classList.contains('js-liveSearch')) {
          target.querySelector('.js-search').focus()
        }
      })
  
      const dropdown = target.querySelector('.js-dropdown')
      const options = dropdown.querySelectorAll('.js-options > *')
  
      options.forEach((el) => {
        el.addEventListener('click', () => {
          title.innerHTML = el.innerHTML
          target.setAttribute("data-select-value", el.getAttribute('data-value'))
          dropdown.classList.toggle('-is-visible')
        })
      })
    }
  
    function liveSearch(target) {
      const search = target.querySelector('.js-search')
      const options = target.querySelectorAll('.js-options > *')
      
      search.addEventListener('input', (event) => {
        let searchTerm = event.target.value.toLowerCase()
  
        options.forEach((el) => {
          el.classList.add('d-none')
  
          if (el.getAttribute('data-value').includes(searchTerm)) {
            el.classList.remove('d-none')
          }
        })
      })
    }
  
    function closeAlldropdowns() {
      const targets = document.querySelectorAll('.js-select, .js-multiple-select')
      if (!targets) return
      
      targets.forEach(el => {
        if (el.querySelector('.-is-visible')) {
          el.querySelector('.-is-visible').classList.remove('-is-visible')
        }
      })
    }
  
    return {
      init: init,
    }
  })()
  
  /*--------------------------------------------------
    05. Custom cursor
  ---------------------------------------------------*/
  
  const Cursor = (function() {
  
    const cursor = document.querySelector(".js-cursor");
    let follower;
    let label;
    let icon;
  
    let clientX;
    let clientY;
    let cursorWidth;
    let cursorHeight;
    let cursorTriggers;
    let state;
  
    function variables() {
  
      follower = cursor.querySelector(".js-follower");
      label = cursor.querySelector(".js-label");
      icon = cursor.querySelector(".js-icon");
  
      clientX = -100;
      clientY = -100;
      cursorWidth = cursor.offsetWidth / 2;
      cursorHeight = cursor.offsetHeight / 2;
      cursorTriggers;
      state = false;
  
    }
  
    function init() {
  
      if (!cursor) return;
  
      variables();
      state = true;
      cursor.classList.add('is-enabled');
  
      document.addEventListener("mousedown", e => {
        cursor.classList.add('is-mouse-down');
      });
  
      document.addEventListener("mouseup", e => {
        cursor.classList.remove('is-mouse-down');
      });
  
      document.addEventListener("mousemove", (event) => {
        clientX = event.clientX;
        clientY = event.clientY;
      });
  
      const render = () => {
        cursor.style.transform = `translate(${clientX - cursorWidth}px, ${clientY - cursorHeight}px)`;
        requestAnimationFrame(render);
      };
  
      requestAnimationFrame(render);
  
      update();
      breakpoint();
  
    }
  
    function enterHandler({ target }) {
  
      cursor.classList.add('is-active');
  
      if (target.getAttribute('data-cursor-label')) {
        App.body.classList.add('is-cursor-active');
        cursor.classList.add('has-label');
        label.innerHTML = target.getAttribute('data-cursor-label');
      }
  
      if (target.getAttribute('data-cursor-label-light')) {
        App.body.classList.add('is-cursor-active');
        cursor.classList.add('has-label-light');
        label.innerHTML = target.getAttribute('data-cursor-label-light');
      }
  
      if (target.getAttribute('data-cursor-icon')) {
        App.body.classList.add('is-cursor-active');
        cursor.classList.add('has-icon');
        const iconAttr = target.getAttribute('data-cursor-icon');
        icon.innerHTML = feather.icons[iconAttr].toSvg();
      }
  
    }
    
    function leaveHandler() {
  
      App.body.classList.remove('is-cursor-active');
      cursor.classList.remove('is-active');
      cursor.classList.remove('has-label');
      cursor.classList.remove('has-label-light');
      cursor.classList.remove('has-icon');
      label.innerHTML = '';
      icon.innerHTML = '';
  
    }
  
    function update() {
  
      if (!cursor) return;
  
      cursorTriggers = document.querySelectorAll([
        "button",
        "a",
        "input",
        "[data-cursor]",
        "[data-cursor-label]",
        "[data-cursor-label-light]",
        "[data-cursor-icon]",
        "textarea"
      ]);
      
      cursorTriggers.forEach(el => {
        el.addEventListener("mouseenter", enterHandler);
        el.addEventListener("mouseleave", leaveHandler);
      });
  
    }
  
    function clear() {
  
      if (!cursor) return;
      
      cursorTriggers.forEach(el => {
        el.removeEventListener("mouseenter", enterHandler);
        el.removeEventListener("mouseleave", leaveHandler);
      });
  
    }
  
    function hide() {
  
      if (!cursor) return;
      cursor.classList.add('is-hidden');
  
    }
  
    function show() {
  
      if (!cursor) return;
      cursor.classList.remove('is-hidden');
  
    }
  
    function breakpoint() {
  
      if (!state) return;
      if (!App.config.cursorFollower.disableBreakpoint) return;
  
      let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  
      if (width < App.config.cursorFollower.disableBreakpoint) {
        state = false;
        cursor.classList.remove('is-enabled');
        clear();
      } else {
        state = true;
        cursor.classList.add('is-enabled');
        update();
      }
  
      window.addEventListener('resize', () => {
        let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  
        if (width < App.config.cursorFollower.disableBreakpoint) {
          state = false;
          cursor.classList.remove('is-enabled');
          clear();
        } else {
          state = true;
          cursor.classList.add('is-enabled');
          update();
        }
      })
  
    }
  
    return {
      init: init,
      leaveHandler: leaveHandler,
      update: update,
      clear: clear,
      hide: hide,
      show: show,
    };
  
  })();
  
  
  const Events = (function() {
    function init() {
      const targets = document.querySelectorAll("[data-x-click]")
      if (!targets) return
  
      targets.forEach((eventTarget) => {
        const attributes = eventTarget.getAttribute('data-x-click').split(', ')
        
        attributes.forEach((el) => {
          const target = document.querySelector(`[data-x=${el}]`)
          
          eventTarget.addEventListener('click', () => {
            const toggleClass = target.getAttribute('data-x-toggle')
            if (!target.classList.contains(toggleClass)) {
              closeAllDropdowns()
            }
            target.classList.toggle(toggleClass)
          })
        })
      })
    }
  
    function ddInit() {
      const targets = document.querySelectorAll(".js-form-dd")
      if (!targets) return
  
      targets.forEach((el) => {
        const eventTarget = el.querySelector('[data-x-dd-click]')
        const attributes = eventTarget.getAttribute('data-x-dd-click').split(', ')
        
        attributes.forEach((el2) => {
          const target = el.querySelector(`[data-x-dd=${el2}]`)
          const toggleClass = target.getAttribute('data-x-dd-toggle')
          
          eventTarget.addEventListener('click', () => {
            if (eventTarget.querySelector('.js-dd-focus'))
              eventTarget.querySelector('.js-dd-focus').focus()
  
            if (target.classList.contains(toggleClass)) {
              target.classList.remove(toggleClass)
              el.classList.remove("-is-dd-wrap-active")
            } else {
              closeAllDropdowns()
              target.classList.add(toggleClass)
              el.classList.add("-is-dd-wrap-active")
            }
          })
        })
      })
    }
  
    return {
      ddInit: ddInit,
      closeAllDropdowns: closeAllDropdowns,
      init: init,
    }
  })()
  
  
  function closeAllDropdowns() {
    const targets = document.querySelectorAll(".js-form-dd")
    if (!targets) return
  
    targets.forEach((el) => {
      if (el.querySelector('.is-active')) {
        el.querySelector('.is-active').classList.remove('is-active')
      }
    })
  
    const alldds = document.querySelectorAll('.js-dropdown.is-active')
  
    alldds.forEach(el => {
      el.classList.remove('is-active')
    })
  }
  
  window.onclick = function(event) {
    if (
      !event.target.closest(".js-form-dd")
    ) {
      closeAllDropdowns()
    }
  
    if (!event.target.closest('.js-select')) {
      const targets = document.querySelectorAll('.js-select')
      if (!targets) return
      
      targets.forEach(el => {
        if (el.querySelector('.-is-visible')) {
          el.querySelector('.-is-visible').classList.remove('-is-visible')
        }
      })
    }
  
    if (!event.target.closest('.js-multiple-select')) {
      const targets = document.querySelectorAll('.js-multiple-select')
      if (!targets) return
      
      targets.forEach(el => {
        if (el.querySelector('.-is-visible')) {
          el.querySelector('.-is-visible').classList.remove('-is-visible')
        }
      })
    }
  }
  
  const Calendar = (function() {
    let currentYear = parseInt(document.getElementById('year').innerHTML);
    const startMonth = 1
    const monthRange = 12
    const HOLIDAY_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000
    const weekDaysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]
    const MAURITIUS_PLAN_SUGGESTIONS = [
      { category: 'international', title: 'Reunion island city break', tag: 'Flight trend', months: [5, 6, 7, 8, 9, 11], minDays: 3, maxDays: 6, reason: 'Quick hop from Mauritius with cool weather and easy weekend timing.', hint: 'Outside Dec peak, fares often trend 20-30% lower.' },
      { category: 'international', title: 'Cape Town shoulder season', tag: 'Flight trend', months: [3, 4, 5, 9, 10], minDays: 5, maxDays: 9, reason: 'Great weather without peak holiday crowds.', hint: 'Shoulder months are usually among the cheapest flight windows.' },
      { category: 'international', title: 'Dubai short escape', tag: 'Flight trend', months: [4, 5, 9, 10], minDays: 4, maxDays: 7, reason: 'Good for a compact city break with lots of indoor activities.', hint: 'Prices often soften just before and after winter high season.' },
      { category: 'international', title: 'Thailand green-season value', tag: 'Hotel trend', months: [5, 6, 7, 8, 9], minDays: 7, maxDays: 12, reason: 'Lower crowds and better hotel deals for longer leave blocks.', hint: 'Rainy season can reduce prices, with showers usually in bursts.' },
      { category: 'international', title: 'Sri Lanka culture loop', tag: 'Flight trend', months: [2, 3, 9, 10], minDays: 5, maxDays: 10, reason: 'Balanced weather for heritage and beach stops in one trip.', hint: 'Shoulder periods commonly show lower fares than Dec-Jan.' },
      { category: 'international', title: 'Madagascar nature route', tag: 'Season pick', months: [4, 5, 6, 7, 8, 9, 10], minDays: 6, maxDays: 10, reason: 'Dry season is ideal for parks, wildlife, and road travel.', hint: 'Book outside school-break weeks for better prices.' },
      { category: 'local-hike', title: 'Le Morne sunrise hike', tag: 'Dry season', months: [5, 6, 7, 8, 9, 10], minDays: 3, maxDays: 6, reason: 'Best visibility and comfort for early-morning climbing.', hint: 'Dry months reduce trail slip risk and improve viewpoints.' },
      { category: 'local-hike', title: 'Black River Gorges trails', tag: 'Dry season', months: [5, 6, 7, 8, 9, 10], minDays: 4, maxDays: 8, reason: 'Cooler temperatures make full-day hikes easier.', hint: 'Pack layers, as upland mornings can feel cold.' },
      { category: 'local-hike', title: 'Tamarind Falls canyon walk', tag: 'Dry season', months: [5, 6, 7, 8, 9], minDays: 3, maxDays: 6, reason: 'Good for active travelers who want a half-day adventure.', hint: 'Dry weather improves footing and route safety.' },
      { category: 'local-place', title: 'Blue Bay and Ile aux Cerfs', tag: 'Beach day', months: [9, 10, 11, 12, 1, 2, 3, 4], minDays: 3, maxDays: 7, reason: 'Calmer sea days are ideal for snorkel and lagoon boating.', hint: 'Weekdays are calmer and often cheaper than weekends.' },
      { category: 'local-place', title: 'Chamarel + seven colored earths', tag: 'Scenic drive', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], minDays: 2, maxDays: 5, reason: 'Reliable all-year option mixing views, cafes, and short stops.', hint: 'Great fallback when the forecast is mixed.' },
      { category: 'local-place', title: 'Pamplemousses and Port Louis day', tag: 'City pick', months: [1, 2, 3, 4, 11, 12], minDays: 2, maxDays: 4, reason: 'Rainy-season friendly plan with flexible indoor breaks.', hint: 'Good option during cyclone-season uncertainty.' },
      { category: 'staycation', title: 'South-coast wellness staycation', tag: 'Rainy-season plan', months: [1, 2, 3], minDays: 2, maxDays: 5, reason: 'Spa and resort plan with low travel effort and weather flexibility.', hint: 'Local resort promos are common outside festive peak dates.' },
    ]
    
    let calendarEl
  
    function updateVars() {
      calendarEl = document.querySelectorAll('.js-calendar-el')
      if (!calendarEl.length) return
    }
  
    const getAllDaysInMonth = (month, year) => {
      let initialMonthArray = Array.from(
        { length: new Date(year, month, 0).getDate() },
        (_, i) => {
          return {
            weekDay: weekDaysOrder[new Date(year, month - 1, i + 1).getDay()],
            dayNum: i + 1,
          }
        }
      )
  
      let daysInBeginning = weekDaysOrder.indexOf(initialMonthArray[0].weekDay)
  
      let testDate = new Date(year, month, 0)
      testDate = new Date(testDate.setDate(0)).toISOString()
  
      testDate = Array.from(
        { length: new Date(testDate).getDate() },
        (_, i) => {
          return {
            weekDay: weekDaysOrder[new Date(new Date(testDate).getFullYear(), new Date(testDate).getMonth(), i + 1).getDay()],
            dayNum: i + 1,
          }
        }
      ).slice(-daysInBeginning)
  
      if (daysInBeginning == 0) {
        testDate = []
      }
  
      const months = ["january","february","march","april","may","june","july","august","september","october","november","december"]
      let monthName = months[new Date(year, month, 0).getUTCMonth()]
  
      return {
        monthName,
        initialMonthArray,
        firstDates: testDate
      }
    }
  
    function getFullYearDates(startDate, countOfMonthToTake) {
      const date = startDate.split('/')
      let allYearMonths = []
  
      for (let i = date[0]; i < parseInt(date[0]) + parseInt(countOfMonthToTake); i++) {
        allYearMonths.push(getAllDaysInMonth(i, date[1]))
      }
  
      return allYearMonths
    }

    function getStoredHolidayData(storageKey) {
      const value = localStorage.getItem(storageKey)
      if (!value) return null

      try {
        const parsed = JSON.parse(value)

        // Backward compatibility with the previous plain payload shape.
        if (parsed && parsed.years) {
          return parsed
        }

        if (!parsed || !parsed.data || !parsed.cachedAt) {
          localStorage.removeItem(storageKey)
          return null
        }

        if (Date.now() - parsed.cachedAt > HOLIDAY_CACHE_TTL_MS) {
          localStorage.removeItem(storageKey)
          return null
        }

        return parsed.data
      } catch (error) {
        localStorage.removeItem(storageKey)
        return null
      }
    }

    function fetchHolidayData(url, storageKey) {
      return fetch(url)
        .then(response => response.json())
        .then(data => {
          localStorage.setItem(storageKey, JSON.stringify({
            cachedAt: Date.now(),
            data,
          }))
          return data
        })
    }

    function formatDateKey(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    function formatPlanDate(date) {
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      })
    }

    function getPlannerDateBounds(year) {
      const startInput = document.getElementById('tripStart')
      const endInput = document.getElementById('tripEnd')
      const minDate = `${year}-01-01`
      const maxDate = `${year}-12-31`

      if (startInput) {
        startInput.min = minDate
        startInput.max = maxDate
        if (startInput.value && (startInput.value < minDate || startInput.value > maxDate)) {
          startInput.value = ''
        }
      }

      if (endInput) {
        endInput.min = minDate
        endInput.max = maxDate
        if (endInput.value && (endInput.value < minDate || endInput.value > maxDate)) {
          endInput.value = ''
        }
      }

      let rangeStart = startInput && startInput.value
        ? new Date(`${startInput.value}T00:00:00`)
        : new Date(`${year}-01-01T00:00:00`)
      let rangeEnd = endInput && endInput.value
        ? new Date(`${endInput.value}T23:59:59`)
        : new Date(`${year}-12-31T23:59:59`)

      if (rangeStart > rangeEnd) {
        const nextStart = new Date(rangeEnd)
        nextStart.setHours(0, 0, 0, 0)
        const nextEnd = new Date(rangeStart)
        nextEnd.setHours(23, 59, 59, 999)
        rangeStart = nextStart
        rangeEnd = nextEnd

        if (startInput) startInput.value = formatDateKey(rangeStart)
        if (endInput) endInput.value = formatDateKey(rangeEnd)
      }

      return {
        rangeStart,
        rangeEnd,
        hasCustomRange: Boolean(startInput && endInput && startInput.value && endInput.value),
      }
    }

    function renderPlannerNotice(message) {
      const notice = document.getElementById('plannerNotice')
      if (!notice) return
      notice.textContent = message || ''
    }

    function pickPlanSuggestions(plan) {
      const month = plan.start.getMonth() + 1
      const tripLength = plan.totalDaysOff || 1

      const matchingSuggestions = MAURITIUS_PLAN_SUGGESTIONS
        .filter(suggestion => suggestion.months.includes(month) && tripLength >= suggestion.minDays && tripLength <= suggestion.maxDays)

      const fallbackSuggestions = MAURITIUS_PLAN_SUGGESTIONS
        .filter(suggestion => suggestion.category === 'local-place')

      const pool = matchingSuggestions.length ? matchingSuggestions : fallbackSuggestions

      const scored = pool
        .map(suggestion => {
          const middleLength = (suggestion.minDays + suggestion.maxDays) / 2
          const lengthDistance = Math.abs(tripLength - middleLength)
          const score = 100 - lengthDistance

          return {
            ...suggestion,
            score,
          }
        })
        .sort((left, right) => right.score - left.score)

      const picked = []
      const usedCategories = new Set()

      scored.forEach(suggestion => {
        if (picked.length >= 3) return
        if (!usedCategories.has(suggestion.category)) {
          picked.push(suggestion)
          usedCategories.add(suggestion.category)
        }
      })

      scored.forEach(suggestion => {
        if (picked.length >= 3) return
        if (!picked.find(item => item.title === suggestion.title)) {
          picked.push(suggestion)
        }
      })

      return picked.slice(0, 3)
    }

    function renderPlanSuggestionHtml(plan) {
      const suggestions = pickPlanSuggestions(plan)

      if (!suggestions.length) {
        return ''
      }

      return `
        <ul class="planner-plan-card__recos">
          ${suggestions.map(suggestion => `
            <li class="planner-plan-card__reco">
              <div class="planner-plan-card__reco-head">
                <span class="planner-plan-card__reco-tag">${suggestion.tag}</span>
                <span class="planner-plan-card__reco-title">${suggestion.title}</span>
              </div>
              <div class="planner-plan-card__reco-text">${suggestion.reason}</div>
              <div class="planner-plan-card__reco-hint">${suggestion.hint}</div>
            </li>
          `).join('')}
        </ul>
      `
    }

    function renderRecommendedPlans(plans, hasCustomRange) {
      const container = document.getElementById('recommended-plans')
      if (!container) return

      if (!plans.length) {
        container.innerHTML = `
          <div class="planner-plan-empty">
            No high-value bridge plan was found in this ${hasCustomRange ? 'date range' : 'year'} yet. Try a wider range, a different remote country, or a larger leave budget.
          </div>
        `
        return
      }

      container.innerHTML = plans.map((plan, index) => `
        <article class="planner-plan-card">
          <div class="planner-plan-card__eyebrow">Top pick ${index + 1}</div>
          <div class="planner-plan-card__title">${plan.totalDaysOff} days off</div>
          <div class="planner-plan-card__meta">Use ${plan.ptoUsed} leave day${plan.ptoUsed > 1 ? 's' : ''} to unlock ${plan.freeDays} free day${plan.freeDays > 1 ? 's' : ''}.</div>
          <div class="planner-plan-card__meta">Efficiency: ${plan.score.toFixed(1)}x return on PTO.</div>
          <div class="planner-plan-card__dates">${formatPlanDate(plan.start)} to ${formatPlanDate(plan.end)}<br>Book off: ${plan.leaveDates.join(', ')}</div>
          ${renderPlanSuggestionHtml(plan)}
        </article>
      `).join('')
    }
  
    function init() {
      updateVars()
      if (!calendarEl.length) return

      currentYear = parseInt(document.getElementById('year').innerHTML);

      let startYear = currentYear
      let responseMu = getStoredHolidayData('publicHolidaysMu');
      let responseFr = getStoredHolidayData('publicHolidaysFr');
      let responseSa = getStoredHolidayData('publicHolidaysSa');

      const yearKey = currentYear.toString()

      if (responseMu && !responseMu?.years?.[yearKey]) {
        localStorage.removeItem('publicHolidaysMu')
        responseMu = null
      }

      if (responseFr && !responseFr?.years?.[yearKey]) {
        localStorage.removeItem('publicHolidaysFr')
        responseFr = null
      }

      if (responseSa && !responseSa?.years?.[yearKey]) {
        localStorage.removeItem('publicHolidaysSa')
        responseSa = null
      }

      if (!responseMu)  {
        fetchHolidayData('./api/mu/public-holidays.json', 'publicHolidaysMu')
          .then(() => {
            init();
          });
        return;
      }

      if (!responseFr) {
        fetchHolidayData('./api/fr/public-holidays.json', 'publicHolidaysFr')
          .then(() => {
            init();
          });
        return;
      }

      if (!responseSa) {
        fetchHolidayData('./api/sa/public-holidays.json', 'publicHolidaysSa')
          .then(() => {
            init();
          });
        return;
      }

      const publicHolidays = responseMu?.years?.[currentYear.toString()] || [];
      const supportedYears = Object.keys(responseMu?.years || {});
      const { rangeStart, rangeEnd, hasCustomRange } = getPlannerDateBounds(currentYear)

      if (!publicHolidays.length) {
        renderPlannerNotice(`Holiday data for ${currentYear} is not available in the shipped dataset yet. Supported years: ${supportedYears.join(', ')}.`)
      } else {
        const holidaysInRange = publicHolidays.filter(holiday => {
          const d = new Date(holiday.date + 'T00:00:00')
          return d >= rangeStart && d <= rangeEnd
        })

        let notice = `Showing the best bridge opportunities between ${formatPlanDate(rangeStart)} and ${formatPlanDate(rangeEnd)}.`

        if (hasCustomRange) {
          if (holidaysInRange.length) {
            const names = holidaysInRange
              .map(h => `${h.name} (${formatPlanDate(new Date(h.date + 'T00:00:00'))})`)
              .join(', ')
            notice += ` ${holidaysInRange.length} public holiday${holidaysInRange.length > 1 ? 's' : ''} in this window: ${names}.`
          } else {
            notice += ' No public holidays fall in this date range - bridge plans work best around holidays. Try a wider window.'
          }
        }

        renderPlannerNotice(notice)
      }

      function isPublicHoliday(monthName, dayNum) {
        const monthIndex = new Date(`${monthName} 1, ${currentYear}`).getMonth() + 1;
        const formattedDate = `${currentYear}-${monthIndex.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
        return publicHolidays.some(holiday => holiday.date === formattedDate);
      }


        //check if js-calendar-slider exists else remove it
        const calendarElements = document.querySelectorAll('.js-calendar-slider');
        
        if (calendarElements !== null && calendarElements !== undefined) {
          calendarElements.forEach(calendarElement => {
            
            if (calendarElement !== null && calendarElement !== undefined) {
              calendarElement.remove();
            }
          })
        }

        let nbOfLeaves =  parseInt(document.getElementById('nbOfDays').innerHTML);
        let remoteLocation = document.getElementById('remotely').innerHTML;
        
        if (isNaN(nbOfLeaves)) {
          nbOfLeaves = 1;
        }

        const _potentialLeaveDays = getPotentialLeaveDays(nbOfLeaves, remoteLocation);
        const potentialLeaveDaysCount = new Set(
          _potentialLeaveDays
            .filter(date => date >= rangeStart && date <= rangeEnd)
            .map(date => formatDateKey(date))
        ).size;

        document.getElementById('potential-leaves').innerHTML = potentialLeaveDaysCount;

        function isNotWednesday(date){
          const day = date.getDay();
          return day !== 3; 
        }
        function isWeekend(date) {
          const day = date.getDay();
          return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
        }

        function buildPlannerDays(remoteLocation) {
          const plannerDays = [];

          for (let month = 0; month < 12; month++) {
            const totalDays = new Date(currentYear, month + 1, 0).getDate();

            for (let day = 1; day <= totalDays; day++) {
              const date = new Date(currentYear, month, day);
              const monthName = date.toLocaleString('en-US', { month: 'long' });
              const isLocalHoliday = publicHolidays.some(holiday => holiday.date === formatDateKey(date));
              const isRemoteHoliday = (remoteLocation == 'South Africa' || remoteLocation == 'France')
                ? isRemotePublicHoliday(remoteLocation, monthName, day)
                : false;
              const freeDay = isWeekend(date) || isLocalHoliday || isRemoteHoliday;

              plannerDays.push({
                date,
                key: formatDateKey(date),
                isFree: freeDay,
              });
            }
          }

          return plannerDays;
        }

        function getRecommendedPlans(days, leaveBudget) {
          if (!leaveBudget || leaveBudget < 1) return []

          const plans = []
          const maxWindowLength = Math.min(days.length, leaveBudget + 12)

          for (let startIndex = 0; startIndex < days.length; startIndex++) {
            const startDay = days[startIndex]

            if (startDay.date < rangeStart || startDay.date > rangeEnd) continue

            let ptoUsed = 0
            let leaveDates = []

            for (let endIndex = startIndex; endIndex < days.length && endIndex < startIndex + maxWindowLength; endIndex++) {
              const endDay = days[endIndex]

              if (endDay.date > rangeEnd) break

              if (!endDay.isFree) {
                ptoUsed += 1
                leaveDates.push(formatPlanDate(endDay.date))
              }

              if (ptoUsed > leaveBudget) break

              const totalDaysOff = endIndex - startIndex + 1
              if (ptoUsed === 0 || totalDaysOff < 3) continue

              const score = totalDaysOff / ptoUsed
              if (score < 1.5) continue

              plans.push({
                start: startDay.date,
                end: endDay.date,
                ptoUsed,
                totalDaysOff,
                freeDays: totalDaysOff - ptoUsed,
                score,
                leaveDates: [...leaveDates],
              })
            }
          }

          plans.sort((left, right) => right.score - left.score || right.totalDaysOff - left.totalDaysOff || left.start - right.start)

          const selectedPlans = []
          plans.forEach(plan => {
            const overlapsExisting = selectedPlans.some(selected => !(plan.end < selected.start || plan.start > selected.end))
            if (!overlapsExisting && selectedPlans.length < 6) {
              selectedPlans.push(plan)
            }
          })

          return selectedPlans
        }

        const recommendedPlans = getRecommendedPlans(buildPlannerDays(remoteLocation), nbOfLeaves)
        renderRecommendedPlans(recommendedPlans, hasCustomRange)

        function getPotentialLeaveDays(leaveDays, remoteLocation) {
          const potentialLeaveDays = [];
          const findNextWorkingDay = (date, remoteLocation) => {
            const nextDay = new Date(date.setDate(date.getDate() + 1));
            const monthName = nextDay.toLocaleString('en-US', { month: 'long' });
            const dayNum = nextDay.getDate();
            
            if (isWeekend(nextDay) ||
            publicHolidays.find(holiday => holiday.date === nextDay.toISOString().split('T')[0]) ||
            ((remoteLocation == 'France' || remoteLocation == 'South Africa') && isRemotePublicHoliday(remoteLocation, monthName, dayNum))
            ) {
              return findNextWorkingDay(nextDay, remoteLocation);
            }
            return nextDay;
          };
          const findPreviousWorkingDay = (date, remoteLocation) => {
            const previousDay = new Date(date.setDate(date.getDate() - 1));
            const monthName = previousDay.toLocaleString('en-US', { month: 'long' });
            const dayNum = previousDay.getDate();

            if (isWeekend(previousDay) ||
            publicHolidays.find(holiday => holiday.date === previousDay.toISOString().split('T')[0]) ||
            ((remoteLocation == 'France' || remoteLocation == 'South Africa') && isRemotePublicHoliday(remoteLocation, monthName, dayNum))
            ) {
              return findPreviousWorkingDay(previousDay, remoteLocation);
            }
            return previousDay;
          };
          
          publicHolidays.forEach((holiday) => {
              const currentHoliday = new Date(holiday?.date);

              if (!currentHoliday) {
                console.error(`Error: Holiday date is null or undefined: ${holiday}`);
                return;
              }

              if(!isWeekend(currentHoliday)) {

                if ((isNotWednesday(currentHoliday) && leaveDays === 1) || ((remoteLocation == 'South Africa' || remoteLocation == 'France') && leaveDays === 1)) {
                  let potentialLeave;
                  switch (currentHoliday.getDay()) {
                    case 1: // Monday
                      potentialLeave = new Date(currentHoliday);
                      potentialLeave.setDate(potentialLeave.getDate() - 3);
                      break;
                    case 2: // Tuesday
                      potentialLeave = new Date(currentHoliday);
                      potentialLeave.setDate(potentialLeave.getDate() - 1);
                      break;
                    case 3: // wednesday
                      potentialLeave = new Date(currentHoliday);
                      potentialLeave.setDate(potentialLeave.getDate() + 1);
                      break;
                    case 4: // Thursday
                      potentialLeave = new Date(currentHoliday);
                      potentialLeave.setDate(potentialLeave.getDate() + 1);
                      break;
                    case 5: // Friday
                      potentialLeave = new Date(currentHoliday);
                      potentialLeave.setDate(potentialLeave.getDate() + 3);
                      break;
                    default:
                  }        
                           
                  if (potentialLeave && (
                    publicHolidays.some(holiday => holiday.date === potentialLeave.toISOString().split('T')[0]) ||
                    ((remoteLocation == 'France' || remoteLocation == 'South Africa') && isRemotePublicHoliday(remoteLocation, potentialLeave.toLocaleString('en-US', { month: 'long' }), potentialLeave.getDate()))
                  )) {
                    potentialLeave = findNextWorkingDay(potentialLeave, remoteLocation);
                  }

                  if (potentialLeave && !publicHolidays.some(holiday => holiday.date === potentialLeave.toISOString().split('T')[0])) {
                    potentialLeaveDays.push(potentialLeave);
                  }
                  
                } else if (leaveDays === 2) {
                  let potentialLeaves = [];
                  let potentialLeave;
                  const currentDay = currentHoliday.getDay();
                  let tempDate = new Date(currentHoliday);

                    switch (currentDay) {
                      case 1: // Monday
                        potentialLeave = findPreviousWorkingDay(tempDate, remoteLocation);
                        if (!publicHolidays.some(holiday => holiday.date === potentialLeave.toISOString().split('T')[0])) {
                          potentialLeaves.push(potentialLeave);
                        }
                        potentialLeave = findNextWorkingDay(tempDate, remoteLocation);
                        if (!publicHolidays.some(holiday => holiday.date === potentialLeave.toISOString().split('T')[0])) {
                          potentialLeaves.push(potentialLeave);
                        }
                        break;
                      case 2: // Tuesday
                        potentialLeave = findPreviousWorkingDay(tempDate, remoteLocation);
                        if (!publicHolidays.some(holiday => holiday.date === potentialLeave.toISOString().split('T')[0])) {
                          potentialLeaves.push(potentialLeave);
                        }

                        potentialLeave = findNextWorkingDay(tempDate, remoteLocation);
                        if (!publicHolidays.some(holiday => holiday.date === potentialLeave.toISOString().split('T')[0])) {
                          potentialLeaves.push(potentialLeave);
                        }
                        break;
                      case 3: // Wednesday
                        potentialLeave = findPreviousWorkingDay(tempDate, remoteLocation);
                        if (!publicHolidays.some(holiday => holiday.date === potentialLeave.toISOString().split('T')[0])) {
                          potentialLeaves.push(potentialLeave);
                        }

                        potentialLeave = findPreviousWorkingDay(tempDate, remoteLocation);
                        if (!publicHolidays.some(holiday => holiday.date === potentialLeave.toISOString().split('T')[0])) {
                          potentialLeaves.push(potentialLeave);
                        }
                        break;
                      case 4: // Thursday
                        potentialLeave = findNextWorkingDay(tempDate, remoteLocation);
                        if (!publicHolidays.some(holiday => holiday.date === potentialLeave.toISOString().split('T')[0])) {
                          potentialLeaves.push(potentialLeave);
                        }

                        potentialLeave = findNextWorkingDay(tempDate, remoteLocation);
                        if (!publicHolidays.some(holiday => holiday.date === potentialLeave.toISOString().split('T')[0])) {
                          potentialLeaves.push(potentialLeave);
                        }
                        break;
                      case 5: // Friday
                        potentialLeave = findNextWorkingDay(tempDate, remoteLocation);
                        if (!publicHolidays.some(holiday => holiday.date === potentialLeave.toISOString().split('T')[0])) {
                          potentialLeaves.push(potentialLeave);
                        }

                        potentialLeave = findPreviousWorkingDay(tempDate, remoteLocation);
                        if (!publicHolidays.some(holiday => holiday.date === potentialLeave.toISOString().split('T')[0])) {
                          potentialLeaves.push(potentialLeave);
                        }
                        break;
                    }

                  potentialLeaveDays.push(...potentialLeaves);
                }
              }
          });

          return potentialLeaveDays;
        }

        function isRemotePublicHoliday(remoteLocation, monthName, dayNum) {
          const monthIndex = new Date(`${monthName} 1, ${currentYear}`).getMonth() + 1;
          const formattedDate = `${currentYear}-${monthIndex.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
          const data = remoteLocation === 'South Africa' ? responseSa : responseFr;
          const remoteHoliday = data?.years?.[currentYear.toString()] || [];
          const localHoliday = publicHolidays.find(holiday => holiday?.date === formattedDate);

          return remoteHoliday.some(holiday => holiday.date === formattedDate && !localHoliday);
        }

        function getHolidayTitle(monthName, dayNum, remoteLocation) {
          var mauritiuanHolidayName = getHolidayName(monthName, dayNum);
          if(mauritiuanHolidayName != '') {
            return mauritiuanHolidayName;
          }else if(remoteLocation === 'South Africa' || remoteLocation === 'France') {
            return getRemoteHolidayName(remoteLocation, monthName, dayNum);
          }
          return '';
        }

        function getHolidayName(monthName, dayNum) {
          const monthIndex = new Date(`${monthName} 1, ${currentYear}`).getMonth() + 1;
          const formattedDate = `${currentYear}-${monthIndex.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
          const holiday = publicHolidays.find(holiday => holiday?.date === formattedDate);
          return holiday ? holiday.name : '';
        }

        function getRemoteHolidayName(remoteLocation, monthName, dayNum) {
          const monthIndex = new Date(`${monthName} 1, ${currentYear}`).getMonth() + 1;
          const formattedDate = `${currentYear}-${monthIndex.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
          const data = remoteLocation === 'South Africa' ? responseSa : responseFr;
          const remoteHoliday = data?.years?.[currentYear.toString()] || [];
          const localHoliday = publicHolidays.find(holiday => holiday?.date === formattedDate);
          const holiday = remoteHoliday.find(holiday => holiday?.date === formattedDate && !localHoliday);
          return holiday ? holiday.name : '';
        }
        
        function isDayAvailable(monthName, dayNum) {
          const startDate = new Date(`${monthName} ${dayNum}, ${currentYear}`);
          const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          };
          
          const isDateInArray = _potentialLeaveDays.some(date => formatDate(date) === formatDate(startDate));
          return isDateInArray;
        }

        function isInSelectedRange(monthName, dayNum, yearOffset = 0) {
          if (!hasCustomRange) return true;
          const date = new Date(`${monthName} ${dayNum}, ${currentYear + yearOffset}`);
          return date >= rangeStart && date <= rangeEnd;
        }

        function monthIntersectsSelectedRange(monthIndex) {
          if (!hasCustomRange) return true;

          const monthStart = new Date(currentYear, monthIndex, 1, 0, 0, 0, 0);
          const monthEnd = new Date(currentYear, monthIndex + 1, 0, 23, 59, 59, 999);

          return monthEnd >= rangeStart && monthStart <= rangeEnd;
        }

        calendarEl.forEach(calendarElement => {
          let calendarGrid = calendarElement.querySelector('.js-calendar-el-calendar');
          let currentMonthId = calendarGrid.id; // Get the current month ID (e.g., 'jan', 'feb', etc.)
          
          let allYearMonths = getFullYearDates(`${startMonth}/${startYear}`, monthRange);
          const monthIndex = allYearMonths.findIndex(month => month.monthName.slice(0, 3).toLowerCase() === currentMonthId)
          const monthWrapper = calendarElement.closest('.col-lg-4') || calendarElement.parentElement

          if (monthWrapper) {
            monthWrapper.style.display = monthIndex === -1 || monthIntersectsSelectedRange(monthIndex) ? '' : 'none'
          }

          if (monthIndex !== -1 && !monthIntersectsSelectedRange(monthIndex)) {
            return
          }

          let globalIndex = 0;
          
          function globalIndexUp() {
            globalIndex = globalIndex + 1;
            return globalIndex;
          }

          function getPreviousMonthName(monthName) {
            const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
            const currentMonthIndex = monthNames.indexOf(monthName);
            return monthNames[(currentMonthIndex - 1 + 12) % 12];
          }
          
          calendarGrid.innerHTML += `
            <div class="elCalendar__slider js-calendar-slider">
              <div class="swiper-wrapper">
                ${allYearMonths.map((month, i) => {
                  let monthId = month.monthName.slice(0, 3).toLowerCase(); // Get the first 3 characters of the month name and convert to lowercase
                  if (monthId !== currentMonthId) return ''; // Skip months that do not match the current month ID
          
                  return `
                    <div class="swiper-slide">
                      <div class="capitalize text-18 fw-500 text-center mb-20">
                        ${month.monthName} ${startMonth + i > 12 ? startYear + 1 : startYear}
                      </div>
          
                      <div class="elCalendar__month">
                        <div class="elCalendar__header">
                          ${weekDaysOrder.map(el => `<div class="elCalendar__header__sell">${el}</div>`).join('')}
                        </div>
                        <div class="elCalendar__body">
                          ${month.firstDates.map(el => `
                            <div
                              data-index="${globalIndexUp()}" data-week="${el.weekDay}" data-month="${month.monthName.slice(0, 3)}"
                              class="elCalendar__sell -dark
                              ${isPublicHoliday(getPreviousMonthName(month.monthName), el.dayNum) ? ' bg-dark-1 text-white tooltip-toggle' : ''}
                              ${isDayAvailable(getPreviousMonthName(month.monthName), el.dayNum, nbOfLeaves) ? 'bg-potential' : ''}
                              ${!isInSelectedRange(getPreviousMonthName(month.monthName), el.dayNum, month.monthName === 'january' ? -1 : 0) ? 'is-out-of-range' : ''}
                              "
                            >
                              <span class="js-date">
                                ${el.dayNum}
                              </span>
                            </div>
                          `).join('')}
          
                          ${month.initialMonthArray.map(el => `
                            <div
                              data-index="${globalIndexUp()}" data-week="${el.weekDay}" data-month="${month.monthName.slice(0, 3)}"
                              class="elCalendar__sell 
                              ${isPublicHoliday(month.monthName, el.dayNum) ? ' bg-dark-1 text-white tooltip-toggle' : ''} 
                              ${remoteLocation === 'South Africa' || remoteLocation === 'France' ? isRemotePublicHoliday(remoteLocation, month.monthName, el.dayNum) ? 'bg-accent-1 text-black tooltip-toggle' : '' : ''} 
                              ${isDayAvailable(month.monthName, el.dayNum, nbOfLeaves) ? 'bg-potential' : ''}
                              ${!isInSelectedRange(month.monthName, el.dayNum) ? 'is-out-of-range' : ''}"
                              title="${getHolidayTitle(month.monthName, el.dayNum, remoteLocation)}" >
                              <span class="js-date">
                                ${el.dayNum}
                              </span>
                            </div>
                          `).join('')}
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
          
              <button class="elCalendar__sliderNav -prev flex-center js-calendar-slider-prev">
                <i class="icon-arrow-left text-20"></i>
              </button>
          
              <button class="elCalendar__sliderNav -next flex-center js-calendar-slider-next">
                <i class="icon-arrow-right text-20"></i>
              </button>
            </div>
          `;
    
          calendarSlider(calendarElement)

          if (window.innerWidth >= 1024) {
            canlendarAlignHeights();
          }

        });

      // }
      // }).catch(error => console.error('Error fetching public holidays:', error));

    }
  
    function canlendarAlignHeights(){
      const calendarSliders = document.querySelectorAll('.js-calendar-el-calendar');
      const calendarsPerRow = 3; // Number of calendars per row
    
      for (let i = 0; i < calendarSliders.length; i += calendarsPerRow) {
        let maxHeight = 0;
        const rowCalendars = Array.from(calendarSliders).slice(i, i + calendarsPerRow);
    
        // Find the maximum height in the current row
        rowCalendars.forEach(slider => {
          const height = slider.offsetHeight;
          if (height > maxHeight) {
            maxHeight = height;
          }
        });
    
        // Set all calendars in the current row to the maximum height if needed
        rowCalendars.forEach(slider => {
          if (slider.offsetHeight < maxHeight) {
            slider.style.height = `${maxHeight}px`;
          }
        });
      }
    }

    function calendarSlider(container) {
      const attributeCheck = container.getAttribute('data-slider-cols-2');
      let breakpoints = false;
  
      if (attributeCheck) {
        breakpoints = {
          991: { slidesPerView: 2 },
        }
      }
      
      // new Swiper(container.querySelector('.js-calendar-slider'), {
      //   speed: 600,
      //   autoHeight: true,
      //   spaceBetween: 30,
      //   slidesPerView: 1,
      //   breakpoints: breakpoints,
      //   // navigation: {
      //   //   prevEl: '.js-calendar-slider-prev',
      //   //   nextEl: '.js-calendar-slider-next',
      //   // },
      // })
    }

    return {
      init: init,
    }
  })();
  
  function initTippy() {
    const sellElements = document.querySelectorAll('.elCalendar__sell.tooltip-toggle');

    sellElements.forEach(el => {
      const title = el.getAttribute('title');

      if (title) {
        tippy(el, {
          content: title
        });
      }
    });
  }

  function calendarInteraction() {
    const target = document.querySelectorAll('.js-calendar')
    if (!target) return
  
    target.forEach(elTarget => {
      const gridCells = elTarget.querySelectorAll('.elCalendar__body > *')
  
      const firstDate = elTarget.querySelector('.js-first-date')
      const lastDate = elTarget.querySelector('.js-last-date')
  
      let completeState = false
      let firstItem = false
      let lastItem = false
  
      gridCells.forEach((el, i) => {
        el.addEventListener('click', () => {
          el.classList.add('-is-active')
  
          if (firstItem && getIndex(firstItem) > getIndex(el)) {
            lastItem = firstItem
            firstItem = el
          }
  
          if (firstItem && !lastItem) {
            lastItem = el
          }
          
          if (!firstItem) {
            firstItem = el
          }
          
          if (completeState) {
            firstItem = false
            lastItem = false
            
            const array = elTarget.querySelectorAll('.-is-active')
            array.forEach(el2 => {
              el2.classList.remove('-is-active')
            })
            
            const array2 = elTarget.querySelectorAll('.-is-in-path')
            array2.forEach(el2 => {
              el2.classList.remove('-is-in-path')
            })
  
            completeState = false
  
          } else if (firstItem && lastItem) {
            const iterationCount = Math.abs(getIndex(firstItem) - getIndex(lastItem))
      
            for (let l = 1; l < iterationCount; l++) {
              const item = elTarget.querySelector(`[data-index="${ getIndex(firstItem) + l }"]`)
              item.classList.add('-is-in-path')
            }
  
            if (firstDate) firstDate.innerHTML = `${firstItem.getAttribute('data-week')} ${firstItem.querySelector('.js-date').innerHTML} ${firstItem.getAttribute('data-month')}`
            if (lastDate) lastDate.innerHTML = `${lastItem.getAttribute('data-week')} ${lastItem.querySelector('.js-date').innerHTML} ${lastItem.getAttribute('data-month')}`
      
            completeState = true
          }
        })
      })
    })
  
    function getIndex(element) {
      return parseInt(element.getAttribute('data-index'))
    }
  }
  
  
  var animateButton = function(e) {

    e.preventDefault;
    //reset animation
    e.target.classList.remove('animate');
    
    e.target.classList.add('animate');
    setTimeout(function(){
      e.target.classList.remove('animate');
    },700);
  };
  
  var bubblyButtons = document.getElementsByClassName("bubbly-button");
  
  for (var i = 0; i < bubblyButtons.length; i++) {
    bubblyButtons[i].addEventListener('click', animateButton, false);
  }

  document.getElementById('plan').addEventListener('click', function() {
    document.querySelector('#planning').style.display = 'block';
    const target = document.getElementById('planning');
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;
  
    window.requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const progressRatio = progress / duration;
      const easeInOutQuad = progressRatio < 0.5 
        ? 2 * progressRatio * progressRatio 
        : -1 + (4 - 2 * progressRatio) * progressRatio;
      window.scrollTo(0, startPosition + distance * easeInOutQuad);
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    });
    Calendar.init();
    initTippy();
  });

  })();
  
  

  