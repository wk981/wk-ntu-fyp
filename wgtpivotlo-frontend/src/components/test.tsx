import useInViewPort from '@/hook/useInViewPort';

export function MyComponent() {
  const { targetRef, inViewport } = useInViewPort({ threshold: 0.5 });
  return (
    <div>
      <div ref={targetRef} style={{ height: '200px', background: inViewport ? 'green' : 'red' }}>
        {inViewport ? 'In viewport' : 'Not in viewport'}
      </div>
    </div>
  );
}
