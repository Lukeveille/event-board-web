export default props => {
  
  if (process.browser) window.onkeydown = event => {if (event.keyCode === 27) props.setShow('none')}

  return (
    <div
      style={{display: props.show }}
      className="modal-bg"
      onClick={() => props.closer? props.setShow('none') : ''}
    >
      <div className="modal-box" onClick={event => event.stopPropagation()}>
        <div className="modal-top-row">
          <div className="x-close-button" onClick={() => props.setShow('none')}>X</div>
        </div>
        <div className="modal-content">{props.children}</div>
      </div>
    </div>
  );
};