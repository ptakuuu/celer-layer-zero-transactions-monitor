import { Grid, Stack } from "@chakra-ui/react";
import Main from "./components/Main";
import TopBar from "./components/TopBar";

function App() {
  return (
    <Stack bgColor="bg.dark" minH="100vh">
      <Grid>
        <TopBar />
        <Main />
      </Grid>
    </Stack>
  );
}

export default App;
