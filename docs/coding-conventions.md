# Coding guidelines / decisions by team

## Abstract

This file contains the app develop team's decisions on coding style and guidelines to follow

## Directory and file naming

      in lower case and dasherized
      /src/utils/date-utils.ts

      components next to tests and storybook stories
      /src/components/foo-boo/foo-boo.tsx
      /src/components/foo-boo/foo-boo.tsx (normally includes types)
      /src/components/foo-boo/foo-boo.test.tsx
      /src/components/foo-boo/foo-boo.stories.tsx
      /src/components/foo-boo/types.ts (optional)

## Folder structure

    /src/components
    /src/navigation
    /src/features
    /src/features/dummy-feature/components
    /src/features/dummy-feature/services
    /src/navigation
    /src/screens
    /src/services
    /src/services/api
    /src/services/authentication
    /src/services/redux
    /src/theme
    /src/utils

we intend to use [Feature Sliced Design](https://feature-sliced.design/)

## Typescript

- we prefer type over interface, only use interfaces when necessary
- no - semicolon


## Test Ids and Accessability IDs

### accessibilityLabel: content is what is read out loud to the user

- content comes from static translations using the same i18n key & testID

### testID: where to apply

- on all pressable links/buttons - apply directly on the
- element having onPress
- on all texts
- on all images
- components for selecting images
- other ui elements, example all components like the bar showing the users budget
- also subcomponents that are visible

### Format:

    VIEW_CONTENT_AREA_ELEMENT_NAME_ELEMENT_TYPE

    Examples:

      contact_diary_day_person_tab_title
      profileEdit_headline_text

    Full Example:

    <Text testID={buildTestId('screens_profileEdit_headline_text')} accessibilityLabel={t('screens_profileEdit_headline_text)} accessible>
