<template>
  <nav v-if="metadata.totalPages > 1" aria-label="Page navigation">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: metadata.currentPage === 1 }">
        <button
          class="page-link"
          @click="changePage(metadata.currentPage - 1)"
          aria-label="Previous"
        >
          <span aria-hidden="true">&laquo;</span>
        </button>
      </li>

      <li
        v-for="pageNumber in maxPagesAtOneTimePages"
        :key="pageNumber"
        class="page-item"
        :class="{ active: metadata.currentPage === pageNumber }"
      >
        <button class="page-link" @click="changePage(pageNumber)">{{
          pageNumber
        }}</button>
      </li>

      <li
        class="page-item"
        :class="{ disabled: metadata.currentPage === metadata.totalPages }"
      >
        <button
          class="page-link"
          @click="changePage(metadata.currentPage + 1)"
          aria-label="Next"
        >
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>
    </ul>
  </nav>
</template>
<script setup>
const props = defineProps(["metadata", "changePage"]);

const maxPagesAtOneTime = 10;

const maxPagesAtOneTimePages = computed(() => {
  const pages = [];

  if (props.metadata.totalPages <= maxPagesAtOneTime) {
    for (let i = 1; i <= props.metadata.totalPages; i++) {
      pages.push(i);
    }
  } else {
    const startPage = props.metadata.currentPage - 5;
    const endPage = props.metadata.currentPage + 4;

    if (startPage <= 0) {
      for (let i = 1; i <= maxPagesAtOneTime; i++) {
        pages.push(i);
      }
    } else if (endPage > props.metadata.totalPages) {
      for (
        let i = props.metadata.totalPages - maxPagesAtOneTime + 1;
        i <= props.metadata.totalPages;
        i++
      ) {
        pages.push(i);
      }
    } else {
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
  }

  return pages;

})
</script>
