import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appsFilter' })
export class AppsFilterPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */
  transform(items: any[], searchText: string, searchName: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    if (!searchName) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(it => {
      
      return it[searchName].toLocaleLowerCase().includes(searchText);
    });
  }
}