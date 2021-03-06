import { useQuery } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Subtitle } from "@leafygreen-ui/typography";
import { Layout } from "antd";
import { Link } from "react-router-dom";
import { useNavbarAnalytics } from "analytics";
import Icon from "components/Icon";
import { StyledLink } from "components/styles";
import { getUserPatchesRoute, routes } from "constants/routes";
import { useAuthStateContext } from "context/auth";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { useLegacyUIURL } from "hooks";
import { environmentalVariables } from "utils";
import { AuxiliaryDropdown } from "./AuxiliaryDropdown";
import { UserDropdown } from "./UserDropdown";

const { getUiUrl } = environmentalVariables;

const { Header } = Layout;
const { white, blue, gray } = uiColors;

export const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuthStateContext();
  const legacyURL = useLegacyUIURL();
  const uiURL = getUiUrl();
  const navbarAnalytics = useNavbarAnalytics();

  const { data } = useQuery<GetUserQuery>(GET_USER);
  const { user } = data || {};
  const { userId } = user || {};

  if (!isAuthenticated) {
    return null;
  }
  return (
    <StyledHeader>
      <InnerWrapper>
        <NavActionContainer>
          <Link
            to={routes.myPatches}
            onClick={() =>
              navbarAnalytics.sendEvent({ name: "Click Logo Link" })
            }
          >
            <Logo>
              <Icon glyph="EvergreenLogo" />
              {/* @ts-expect-error */}
              <StyledSubtitle>Evergreen</StyledSubtitle>
            </Logo>
          </Link>

          <PrimaryA
            href={`${uiURL}/waterfall`}
            onClick={() =>
              navbarAnalytics.sendEvent({ name: "Click Waterfall Link" })
            }
          >
            Waterfall
          </PrimaryA>
          <PrimaryLink to={`${getUserPatchesRoute(userId)}`}>
            My Patches
          </PrimaryLink>
          <PrimaryLink to={routes.spawnHost}>My Hosts</PrimaryLink>
          <AuxiliaryDropdown />
        </NavActionContainer>
        <NavActionContainer>
          {legacyURL && (
            <SecondaryLink
              href={legacyURL}
              data-cy="legacy-ui-link"
              onClick={() =>
                navbarAnalytics.sendEvent({ name: "Click Legacy UI Link" })
              }
            >
              Switch to legacy UI
            </SecondaryLink>
          )}
          <UserDropdown />
        </NavActionContainer>
      </InnerWrapper>
    </StyledHeader>
  );
};

const StyledHeader = styled(Header)`
  background-color: ${gray.dark3};
  padding: 0 36px;
`;

const InnerWrapper = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
`;

/* @ts-expect-error */
const StyledSubtitle = styled(Subtitle)`
  color: ${white};
  margin-left: 8px;
`;

const NavActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > :not(:last-child) {
    margin-right: 40px;
  }
`;

const primaryStyle = css`
  color: ${white};
`;

const PrimaryLink = styled(Link)`
  ${primaryStyle}
`;

const PrimaryA = styled.a`
  ${primaryStyle}
`;

const secondaryStyle = css`
  color: ${blue.light2};
`;

const SecondaryLink = styled(StyledLink)`
  ${secondaryStyle}
`;
