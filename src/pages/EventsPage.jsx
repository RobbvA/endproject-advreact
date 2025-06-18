import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categoryIds: "",
  });

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchEvents = () => {
    fetch("http://localhost:3000/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error loading events..sorry..");
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    fetch("http://localhost:3000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error:", err));
  };

  const getCategoryName = (id) => {
    const match = categories.find((cat) => String(cat.id) === String(id));
    return match ? match.name : id;
  };

  const getCategoryNames = (ids) => {
    return ids
      .map((id) => getCategoryName(id))
      .filter(Boolean)
      .join(", ");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleCategoryChange = (e) => setFilterCategory(e.target.value);

  const filteredEvents = events.filter((event) => {
    const lowerSearch = searchTerm.toLowerCase();

    const matchesSearch =
      event.title.toLowerCase().includes(lowerSearch) ||
      event.description.toLowerCase().includes(lowerSearch);

    const matchesCategory =
      !filterCategory ||
      (Array.isArray(event.categoryIds) &&
        event.categoryIds.includes(filterCategory)) ||
      event.categoryIds.includes(Number(filterCategory));

    return matchesSearch && matchesCategory;
  });

  const handleAddEvent = () => {
    if (
      !newEvent.title ||
      !newEvent.description ||
      !newEvent.startTime ||
      !newEvent.endTime
    ) {
      toast({
        title: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const eventToAdd = {
      ...newEvent,
      categoryIds: newEvent.categoryIds
        ? newEvent.categoryIds.split(",").map((cat) => cat.trim())
        : [],
    };

    fetch("http://localhost:3000/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventToAdd),
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents((prev) => [data, ...prev]);
        toast({
          title: "Event added",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        setNewEvent({
          title: "",
          description: "",
          image: "",
          startTime: "",
          endTime: "",
          categoryIds: "",
        });
      })
      .catch((error) => {
        toast({
          title: "Fout bij toevoegen event",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">Error: {error}</Text>;

  return (
    <>
      {/* Achtergrondkleur full screen */}
      <Box
        bg="gray.700"
        minH="100vh"
        w="100vw"
        position="fixed"
        top="0"
        left="0"
        zIndex="-1"
      />

      {/* Content container */}
      <Box
        padding="4"
        maxW="800px"
        margin="0 auto"
        display="flex"
        flexDirection="column"
        alignItems="center"
        minH="100vh"
      >
        <Heading mb="4" color="#ccd2db" textAlign="center" w="100%">
          Events
        </Heading>

        <Button mb="6" colorScheme="blue" onClick={onOpen} color="gray.900">
          Add Event
        </Button>

        <Input
          placeholder="Search events..."
          mb="4"
          value={searchTerm}
          onChange={handleSearchChange}
          maxW="400px"
        />

        <FormControl mb="6" maxW="300px" color="gray.900" w="100%">
          <FormLabel>Filter Categories</FormLabel>
          <Select
            placeholder="All"
            value={filterCategory}
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </FormControl>

        {/* Modal voor event toevoegen */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add new event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb="3" isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mb="3" isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mb="3">
                <FormLabel>Image URL</FormLabel>
                <Input
                  name="image"
                  value={newEvent.image}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mb="3" isRequired>
                <FormLabel>Starttime</FormLabel>
                <Input
                  type="datetime-local"
                  name="startTime"
                  value={newEvent.startTime}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mb="3" isRequired>
                <FormLabel>Endtime</FormLabel>
                <Input
                  type="datetime-local"
                  name="endTime"
                  value={newEvent.endTime}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mb="3">
                <FormLabel>Category IDs (comma separated)</FormLabel>
                <Input
                  name="categoryIds"
                  value={newEvent.categoryIds}
                  onChange={handleInputChange}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr="3" onClick={handleAddEvent}>
                Add Event
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Events lijst */}
        {filteredEvents.map((event) => (
          <Link
            to={`/event/${event.id}`}
            key={event.id}
            style={{ width: "100%" }}
          >
            <Box
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              mb="4"
              p="4"
              _hover={{ bg: "gray.600", cursor: "pointer" }}
              bg="gray.800"
              maxW="700px"
              mx="auto"
            >
              {event.image && (
                <Image
                  src={event.image}
                  alt={event.title}
                  maxH="200px"
                  objectFit="cover"
                  borderRadius="md"
                />
              )}
              <Heading size="md" mt="2" color="#ccd2db">
                {event.title}
              </Heading>
              <Text mt="1" color="#ccd2db">
                {event.description}
              </Text>
              <Text mt="1" fontSize="sm" color="gray.300">
                Start: {new Date(event.startTime).toLocaleString()} - End:{" "}
                {new Date(event.endTime).toLocaleString()}
              </Text>
              <Text mt="1" fontSize="sm" color="gray.300">
                Categories: {getCategoryNames(event.categoryIds || [])}
              </Text>
            </Box>
          </Link>
        ))}
      </Box>
    </>
  );
};

export default EventsPage;
