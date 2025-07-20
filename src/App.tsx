import { Block } from "baseui/block";
import { Heading } from "baseui/heading";

function App() {
  return (
    <Block>
      <Block>
        <Heading level={3} margin="scale600">
          YNAB Budget Lab
        </Heading>
      </Block>
      <Block as="main">{/* Main content area */}</Block>
    </Block>
  );
}

export default App;
