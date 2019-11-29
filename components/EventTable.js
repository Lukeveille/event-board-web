import Link from 'next/link';
import dateTimeString from '../utils/date-time-string';

export default props => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>Name</th>
            <th>Image</th>
            <th>Attending</th>
            <th>Host</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
        {props.events.map(event => {
          const [dateString, timeString] = dateTimeString(event.start),
          user = event.users_attending.filter(user => user.id === event.user_id)[0],
          owner = props.user.id === event.user_id,
          attending = event.users_attending.map(user => user.id).includes(props.user.id);
          
          return (props.filter === 'none' || props.filter === event.category_name)? (
            <Link href="/[event]" as={`${event.id}`} key={event.id}>
              <tr
                className="event-listing"
                style={{
                  backgroundColor: attending? owner? '#eef' : '#efe' : '#fff'
                }}
              >
                <td>{dateString}</td>
                <td>{timeString}</td>
                <td>{event.name}</td>
                <td>
                  {event.image_link? <img src={event.image_link} alt={event.name}/> : ''}
                </td>
                {attending? <th>{event.users_attending.length} / {event.limit}</th> :
                <td>{event.users_attending.length} / {event.limit}</td>}
                {owner?<th>You</th> : <td>{user.full_name}</td>}
                <td>{event.category_name}</td>
              </tr>
            </Link>
          ) : (null)
        })}
        </tbody>
      </table>
      <style jsx>{`
        table {
          margin: 1rem auto;
        }
        tr {
          outline: 1px solid #ddd
        }
        tbody tr:hover {
          outline: 1px solid #444
        }
        td, th {
          padding: 2rem 1rem;
        }
        .event-listing {
          cursor: pointer;
        }
        img {
          max-height: 2rem;
        }
      `}</style>
    </div>
  )
}