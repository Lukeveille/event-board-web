import Link from 'next/link';

export default props => (
  <header style={{
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #666',
    padding: '1rem'
  }}>
    <Link href="/">
      <img src="../static/logo.png" className="logo" />
    </Link>
    <section className="new-event">
      <Link href="/new-event"><a>+ New Event</a></Link>
    </section>
    <section>
      <Link href="/login"><a>Login</a></Link>
      &nbsp;/&nbsp;
      <Link href="/"><a>Signup</a></Link>
    </section>
    <style jsx>{`
      img {
        max-width: 20rem;
      }
      .new-event {
        margin-left: -10rem;
      }
      .logo {
        cursor: pointer
      }
    `}</style>
  </header>
);
