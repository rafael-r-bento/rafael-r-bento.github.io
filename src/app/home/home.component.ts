import { Component, ElementRef, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post, PostsRowsService } from '../posts-rows.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [PostsRowsService],
})
export class HomeComponent {
  items: any;
  
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private postsService: PostsRowsService,
  ) {
    this.postsService.listPosts().subscribe(response => {
      this.items = (response as any).items;
      this.items.sort((a: Post, b: Post) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
    });
  }

  ngOnInit() {
    let search: HTMLInputElement = <HTMLInputElement>document.getElementById("search");

    search?.addEventListener("input", () => {
      const searchText = search.value.toLowerCase().trim().normalize('NFD').replace(/\p{Diacritic}/gu, "");
      const searchTerms = searchText.split(" ");
      const hasFilter = searchText.length > 0;

      this.postsService.getRows().forEach(post => {
	const searchString = post?.textContent?.toLowerCase().trim().normalize('NFD').replace(/\p{Diacritic}/gu, "");
	const isMatch = searchTerms.every(term => searchString?.includes(term));

	post.classList.toggle("d-none", !isMatch);
      })
    });
  }

  chooseBadgeColor(category: String) {
    if (category == 'Hardware')
      return 'text-bg-secondary';
    else if (category == 'Operating Systems')
      return 'text-bg-primary';
    else if (category == 'Software')
      return 'text-bg-warning';
    else
      return 'text-bg-dark';
  }
}
