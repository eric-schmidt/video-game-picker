import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  EntityList,
  Form,
  FormControl,
  Spinner,
  TextInput,
  TextLink,
} from "@contentful/f36-components";
import { useSDK } from "@contentful/react-apps-toolkit";

const Dialog = () => {
  const sdk = useSDK();
  const apiKey = sdk.parameters.installation.apiKey;
  const pageSize = "5";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchUrl, setSearchUrl] = useState(
    `https://api.rawg.io/api/games?key=${apiKey}&page_size=${pageSize}`
  );
  const [gameData, setGameData] = useState();

  const fetchGames = async (url) => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const json = await response.json();
      // Update game data and loading state.
      setGameData(json);
      setLoading(false);
    } catch (err) {
      setError(true);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGames(searchUrl);
  }, [searchUrl]);

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  // Break results out into separate component for easier conditional rendering.
  const Results = () => {
    if (error) {
      return (
        <Box marginTop="spacingL" marginBottom="spacingL">
          Error! Please ensure you've added your{" "}
          <TextLink href="https://rawg.io/apidocs" target="_blank">
            RAWG.io API key
          </TextLink>{" "}
          on the Video Game Picker app configuration screen. Check your
          browser's console for more error details.
        </Box>
      );
    } else if (gameData && gameData.count === 0) {
      return (
        <Box marginTop="spacingL" marginBottom="spacingL">
          No Results Found. Please try a different search term.
        </Box>
      );
    } else if (!gameData || loading) {
      return (
        <Box marginTop="spacingL" marginBottom="spacingL">
          <Spinner customSize={50} />
        </Box>
      );
    } else {
      return (
        <Box marginTop="spacingXl" marginBottom="spacingM">
          <EntityList>
            {gameData.results.map((game) => (
              <EntityList.Item
                key={game.id}
                title={`${game.name}${
                  sdk.parameters.invocation === game.name ? " (selected)" : ""
                }`}
                thumbnailUrl={game.background_image}
                onClick={() =>
                  sdk.close({
                    game: {
                      id: game.id,
                      name: game.name,
                      slug: game.slug,
                      image: game.background_image,
                    },
                  })
                }
              />
            ))}
          </EntityList>
        </Box>
      );
    }
  };

  return (
    <>
      <Box
        paddingTop="spacingL"
        paddingRight="spacing2Xl"
        paddingBottom="spacingL"
        paddingLeft="spacing2Xl"
      >
        <Form
          onSubmit={() => {
            fetchGames(
              `https://api.rawg.io/api/games?key=${apiKey}&search=${searchTerm}&page_size=${pageSize}`
            );
          }}
        >
          <FormControl marginBottom="spacingXs">
            <FormControl.Label>Search</FormControl.Label>
            <TextInput
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            <FormControl.HelpText>
              Please enter some search terms.
            </FormControl.HelpText>
          </FormControl>
          <Button type="submit" variant="primary">
            Search
          </Button>
        </Form>

        {/* Render the results. */}
        {<Results />}

        <Box>
          {/* Use the provided prev/next URLs that RAWG supplies, reactively updating searchUrl re-triggers the fetch. */}
          {gameData && gameData.previous && (
            <Button onClick={() => setSearchUrl(gameData.previous)}>
              Previous
            </Button>
          )}
          {gameData && gameData.next && (
            <Button onClick={() => setSearchUrl(gameData.next)}>Next</Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Dialog;
