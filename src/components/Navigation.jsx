import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Flex, Link, List, ListItem } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <Box bg="gray.700" p={4}>
      <Flex as="nav" justify="center">
        <List display="flex" gap={6} styleType="none" m={0} p={0}>
          <ListItem>
            <Link
              as={RouterLink}
              to="/"
              color="#ccd2db"
              _hover={{ textDecoration: "underline", color: "teal.300" }}
            >
              Back to list of Events
            </Link>
          </ListItem>
          <ListItem>
            <Link
              as={RouterLink}
              to="/event/1"
              color="#ccd2db"
              _hover={{ textDecoration: "underline", color: "teal.300" }}
            >
              Selected Event
            </Link>
          </ListItem>
        </List>
      </Flex>
    </Box>
  );
};
