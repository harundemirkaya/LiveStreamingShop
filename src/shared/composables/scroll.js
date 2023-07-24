import { ref } from 'vue';

export function useScroll() {
  const boxRefPos = ref({ isLeft: true, isRight: false });

  function handleScroll(divId) {
    const { scrollLeft, scrollWidth, clientWidth } =
      document.getElementById(divId);

    // end check
    if (scrollWidth - (scrollLeft + clientWidth) < 5) {
      boxRefPos.value = { ...boxRefPos.value, isRight: true };
    } else boxRefPos.value = { ...boxRefPos.value, isRight: false };

    // start check
    if (scrollLeft === 0)
      boxRefPos.value = { ...boxRefPos.value, isLeft: true };
    else boxRefPos.value = { ...boxRefPos.value, isLeft: false };
  }

  function handleScrollLeft(divId) {
    document.getElementById(divId).scrollLeft -= 200;
  }

  function handleScrollRight(divId) {
    document.getElementById(divId).scrollLeft += 200;
  }

  return { handleScroll, handleScrollLeft, handleScrollRight, boxRefPos };
}
