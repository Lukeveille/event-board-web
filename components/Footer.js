import Link from 'next/link';

export default () => {
  return (
    <footer>
      <Link href="/"><a>&lt; All Events</a></Link>
      <style jsx>{`
        footer {
          grid-column: span 2;
          margin-top: 5rem;
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          padding: 2rem;
          text-align: center;
        }
      `}</style>
    </footer>
  );
};
