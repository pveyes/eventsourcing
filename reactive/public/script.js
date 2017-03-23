const box = document.querySelector('#box');

const mouseDown$ = Rx.Observable.fromEvent(box, 'mousedown');
const mouseMove$ = Rx.Observable.fromEvent(box, 'mousemove');
const mouseUp$ = Rx.Observable.fromEvent(box, 'mouseup');

const mouseDrag$ = mouseDown$.flatMap(mouseDownEvent => {
  const posClickTop = mouseDownEvent.offsetY;
  const posClickLeft = mouseDownEvent.offsetX;

  return mouseMove$
    .map(mouseMoveEvent => {
      return {
        top: mouseMoveEvent.clientY - posClickTop,
        left: mouseMoveEvent.clientX - posClickLeft,
      };
    })
    .takeUntil(mouseUp$);
});

mouseDrag$.subscribe(pos => {
  // 15px;
  box.style.top = pos.top + 'px';
  box.style.left = pos.left + 'px';
});
