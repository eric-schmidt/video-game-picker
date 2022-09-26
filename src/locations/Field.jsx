import React, { useEffect } from 'react';
import { Box, Button, EntityList, MenuItem } from '@contentful/f36-components';
import { /* useCMA, */ useSDK, useFieldValue } from '@contentful/react-apps-toolkit';
// import { JsonEditor } from '@contentful/field-editor-json';

const Field = () => {
  const sdk = useSDK();
  const [value, setValue] = useFieldValue();

  const handleClick = async () => {
    const result = await sdk.dialogs.openCurrentApp({
      shouldCloseOnEscapePress: true,
      shouldCloseOnOverlayClick: true,
      minHeight: '600px',
      // title: 'Select a game',
      // @ts-expect-error The App SDK types are not correct :(
      parameters: value,
    });
    if (!result) {
      return;
    }
    // Populate JSON field, and also set CF entry title.
    sdk.entry.fields.title.setValue(result.game.name);
    setValue(result);
  };

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/

  return (
    <>
      <Box marginBottom='spacingM'>
        <Button variant='primary' onClick={handleClick}>
          Select a game
        </Button>
      </Box>
      {value?.game && (
        <EntityList>
          <EntityList.Item
            title={value.game.name}
            thumbnailUrl={value.game.image}
            actions={[
              <MenuItem
                key='remove'
                onClick={() => {
                  sdk.field.removeValue();
                }}
              >
                Remove
              </MenuItem>,
            ]}
          />
        </EntityList>
      )}
      {/* <JsonEditor field={sdk.field} /> */}
    </>
  );
};

export default Field;
