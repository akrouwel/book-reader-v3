import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import anime from 'animejs';
import { MenuController, Platform } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { menuOutline, settingsOutline } from 'ionicons/icons';
import { defineCustomElements } from '@ionic/pwa-elements/loader';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class AppComponent implements AfterViewInit {
  pages: string[] = [];
  currentPage = 0;
  seenPages = new Set<number>();
  wordsPerPage = 100;
  fontSize = 18;
  textSpeed = 80;
  isDarkMode = false;
  modalOpen = false; // Property to control modal visibility

  constructor(private menuCtrl: MenuController, private platform: Platform) {
    this.loadBook('book1'); // Example book name
    this.platform.ready().then(() => {
      this.setupIonicons();
      this.menuCtrl.enable(true, 'main-content'); // Ensure the menu is enabled
    });
  }

  setupIonicons() {
    addIcons({
      'menu-outline': menuOutline,
      'settings-outline': settingsOutline
    });
  }



  loadBook(bookName: string) {
    // TODO: Implement fetch here with Angular's HttpClient
    // For now, simulate:
    this.pages = ['This is page 1.', 'And here is page 2.']; // Example content
    this.currentPage = 0;
    this.seenPages.clear();
    this.renderPage(this.currentPage);
  }

  splitIntoPages(text: string): string[] {
    const words = text.split(/\s+/);
    let result = [];
    for (let i = 0; i < words.length; i += this.wordsPerPage) {
      result.push(words.slice(i, i + this.wordsPerPage).join(' '));
    }
    return result;
  }

  renderPage(index: number) {
    if (index < 0 || index >= this.pages.length) return;
    const bookContent = document.getElementById('bookContent');

    if (bookContent) {
      bookContent.textContent = this.pages[index];

      if (!this.seenPages.has(index)) {
        bookContent.innerHTML = bookContent.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        anime.timeline({loop: false}).add({
          targets: '.letter',
          opacity: [0,1],
          easing: "easeInOutQuad",
          duration: 2250,
          delay: (el: HTMLElement, i: number) => this.textSpeed * (i+1)
        });
        this.seenPages.add(index);
      }
    }
  }

  nextPage() {
    if (this.currentPage < this.pages.length - 1) {
      this.currentPage++;
      this.renderPage(this.currentPage);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.renderPage(this.currentPage);
    }
  }


ngAfterViewInit() {
  this.menuCtrl.enable(true, 'main-content').then(() => {
    console.log('Menu enabled successfully');
    // Attempt to open the menu manually
    this.menuCtrl.open('main-content').then(() => {
      console.log('Menu opened manually');
    }).catch((error) => {
      console.error('Failed to open menu:', error);
    });
  }).catch((error) => {
    console.error('Failed to enable menu:', error);
  });
  this.scrollToTop();
}

toggleMenu() {
  console.log('Menu toggle button clicked');
  this.menuCtrl.isOpen('main-content').then((isOpenBefore) => {
    console.log('Menu state before toggle:', isOpenBefore ? 'open' : 'closed');
    this.menuCtrl.toggle('main-content').then(() => {
      console.log('Menu toggled');
      this.menuCtrl.isOpen('main-content').then((isOpenAfter) => {
        console.log('Menu state after toggle:', isOpenAfter ? 'open' : 'closed');
      });
    }).catch((error) => {
      console.error('Menu toggle error:', error);
    });
  });
}


  scrollToTop() {
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 100);
  }

  // New methods


  closeModal() {
    this.modalOpen = false; // Close the modal
  }

  fontSizeDecrease() {
    if (this.fontSize > 12) {
      this.fontSize--;
      this.updateFontSize();
    }
  }

  fontSizeIncrease() {
    if (this.fontSize < 30) {
      this.fontSize++;
      this.updateFontSize();
    }
  }

  updateSpeed(event: Event) {
    this.textSpeed = parseInt((event.target as HTMLSelectElement).value);
    this.renderPage(this.currentPage); // Re-render to apply new speed
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('normalMode');
    } else {
      document.body.classList.add('normalMode');
      document.body.classList.remove('dark-mode');
    }
  }

  updateFontSize() {
    const bookContent = document.getElementById('bookContent');
    if (bookContent) {
      bookContent.style.fontSize = `${this.fontSize}px`;
    }
  }

  openModal() {
    this.modalOpen = true;
  }

  // New methods for direct calculation in the template
  calculateProgress(): number {
    return (this.currentPage + 1) / this.pages.length * 100;
  }

  calculateCompletionPercentage(): number {
    return Math.round(((this.currentPage + 1) / this.pages.length) * 100);
  }
}