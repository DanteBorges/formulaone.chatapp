const MessageContainer = ({ messages }) => {
  return (
    <>
      {messages.map((msg, index) => (
        <table striped bordered>
          <tr key={index}>
            <td>
              {msg.msg}- {msg.username}
            </td>
          </tr>
        </table>
      ))}
    </>
  );
};

export default MessageContainer;
