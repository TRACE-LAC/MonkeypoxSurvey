import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modals: any[] = [];
  
  /**
   * @description This function adds a modal to array of active modals
   */
  add(modal: any): void {
      // add modal to array of active modals
      this.modals.push(modal);
  }
  
  /**
   * @description This function removes a modal to array of active modals
   */
  remove(id: string): void {
      // remove modal from array of active modals
      this.modals = this.modals.filter(m => m.id !== id);
  }
  
  /**
   * @description This function opens a modal specified by id
   */
  open(id: string): void {
      // open modal specified by id
      const modal = this.modals.find(m => m.id === id);
      modal.open();
  }
  
  /**
   * @description This function closes a modal specified by id
   */
  close(id: string): void {
      // close modal specified by id
      const modal = this.modals.find(m => m.id === id);
      modal.close();
  }
}
