import Link from 'next/link';

export default () => {
  return (
    <footer>
      <Link href="/"><a>&lt; All Events</a></Link>
      <style jsx>{`
        footer {
          grid-column: span 2;
          margin-top: 5rem;
        }
      `}</style>
    </footer>
  );
};
