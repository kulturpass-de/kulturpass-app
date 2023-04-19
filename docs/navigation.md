### How to add a new modal screen

#### 1. Create the route components in `src/screens/**`

- create a file with the format of `src/screens/${routeGroup}/${routeName}-route.tsx`
- add a constant containing the navigation key (i.e. internal "url") of the route
- add a type that will contain the navigation params for that route, even if the route will not have any params
- add a react functional component representing the route itself
  - everything in regards to navigation should be done in this component (route params checking, navigation)
  - the route component should return (render) the respective screen, providing to it as props any needed navigation functionality
- add a route configuration which will be used to add this route to the navigation stacks of the app

```ts
// src/screens/auth/registration-form-route.tsx

export const RegistrationFormRouteName = 'RegistrationForm'

export type RegistrationFormRouteParams = { userType: UserType }

export const RegistrationFormRoute: React.FC = () => {
  const tabsNavigation = useTabsNavigation()

  const onHeaderPressClose = useCallback(() => {
    tabsNavigation.navigate(HomeRouteConfig.name)
  }, [tabsNavigation])

  return <RegistrationFormScreen onHeaderPressClose={onHeaderPressClose} />
}

export const RegistrationFormRouteConfig = createRouteConfig({
  name: RegistrationFormRouteName,
  component: RegistrationFormRoute,
  options: { cardStyle: modalCardStyle },
})
```

#### 2. Add the route to the `ModalStack`

- make the route available to the `ModalStack` by adding its params to `ModalParamList` in `src/navigation/modal/types.ts`
- add the route to the `ModalStack` itself in `src/navigation/modal/modal-stack.tsx`

```ts
// src/navigation/modal/types.ts

export type ModalParamList = {
  ...
  [RegistrationFormRouteName]: RegistrationFormRouteParams
  ...
}
```

```ts
// src/navigation/modal/modal-stack.tsx

export const ModalStack: React.FC = () => {
  return (
    <ModalStackWrapper>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        ...
        {/* Registration Routes */}
        <Stack.Screen {...RegistrationFormRouteConfig} />
        ...
      </Stack.Navigator>
    </ModalStackWrapper>
  )
}
```

#### 3. Use route params

- make use of `useModalRoute<RouteName>` and adjust your react route compoenent accordingly

```ts
// src/screens/auth/registration-form-route.tsx

export type RegistrationFormRouteParams = { userType: UserType }

export const RegistrationFormRoute: React.FC = () => {
  ...
  const route = useModalRoute<typeof RegistrationFormRouteName>()

  useEffect(() => {
    console.log(route.params.userType)
  }, [route.params])

  ...

  return <RegistrationFormScreen onHeaderPressClose={onHeaderPressClose} />
}
```

#### 4. Implement the screen view

- in the same directory create a file with the format of `src/screens/${routeGroup}/${routeName}-screen.tsx`
- add as props any needed navigation functionality
- wrap the rendering of your screen component in `<ModalScreen></ModalScreen>`
- if needed add `<ModalScreenHeader />` as first child inside `<ModalScreen>`

```ts
// src/screens/auth/registration-form-screen.tsx

export type RegistrationFormScreenProps = {
  onHeaderPressClose: () => void
}

export const RegistrationFormScreen: React.FC<RegistrationFormScreenProps> = ({ onHeaderPressClose }) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

  return (
    <ModalScreen testID={buildTestId('registrationForm')}>
      <ModalScreenHeader
        title={t('registrationForm_headline')}
        testID={buildTestId('registrationForm_headline')}
        onPressClose={onHeaderPressClose}
      />
      ...
    </ModalScreen>
  )
}
```

#### 5. Navigate to the new route

- in any react route component make use of `useModalNavigation`

```ts
// src/screens/auth/log-in-route.tsx

export const LogInRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()

  ...

  const onPressRegisterNow = useCallback(() => {
    modalNavigation.navigate({ screen: RegistrationFormRouteConfig.name })
  }, [modalNavigation])

  return <LogInScreen onPressRegisterNow={onPressRegisterNow} />
}
```
