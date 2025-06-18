import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Image,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Stack,
  useToast,
  Flex,
} from "@chakra-ui/react";

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [creator, setCreator] = useState(null); // nieuwe state voor createdBy user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Voor de edit modal
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  // Voor de delete confirm modal
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const toast = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categories: "",
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    setEvent(null);
    setCreator(null);

    // Eerst event ophalen
    fetch(`http://localhost:3000/events/${eventId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Event not found");
        return res.json();
      })
      .then((data) => {
        setEvent(data);

        setFormData({
          title: data.title || "",
          description: data.description || "",
          image: data.image || "",
          startTime: data.startTime ? data.startTime.slice(0, 16) : "",
          endTime: data.endTime ? data.endTime.slice(0, 16) : "",
          categories: data.categories ? data.categories.join(", ") : "",
        });

        // Nu de creator ophalen met het ID uit createdBy
        if (data.createdBy) {
          return fetch(`http://localhost:3000/users/${data.createdBy}`);
        } else {
          return null;
        }
      })
      .then((res) => {
        if (res) {
          if (!res.ok) throw new Error("Creator not found");
          return res.json();
        }
        return null;
      })
      .then((userData) => {
        if (userData) setCreator(userData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [eventId]);

  if (loading)
    return (
      <Flex
        bg="gray.700"
        minHeight="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="xl" />
      </Flex>
    );
  if (error)
    return (
      <Flex
        bg="gray.700"
        minHeight="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <Alert status="error" mt="10" maxW="600px" w="90%">
          <AlertIcon />
          {error}
        </Alert>
      </Flex>
    );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedEvent = {
      ...event,
      title: formData.title,
      description: formData.description,
      image: formData.image,
      startTime: formData.startTime,
      endTime: formData.endTime,
      categories: formData.categories
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat.length > 0),
    };

    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update event");
        return res.json();
      })
      .then((data) => {
        setEvent(data);
        toast({
          title: "Event updated.",
          description: "The event was successfully updated.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
        onEditClose();
      })
      .catch((err) => {
        toast({
          title: "Error updating event.",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      });
  };

  // Verwijder functie met Chakra confirm modal
  const handleDelete = () => {
    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete event");
        toast({
          title: "Event deleted.",
          description: "The event was successfully deleted.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
        navigate("/");
      })
      .catch((err) => {
        toast({
          title: "Error deleting event.",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      });
    onDeleteClose();
  };

  return (
    <Flex
      bg="gray.700"
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      p="4"
    >
      <Box
        maxW="600px"
        w="100%"
        bg="gray.800"
        borderRadius="md"
        boxShadow="lg"
        p="6"
        color="white"
      >
        <Heading mb="4">{event.title}</Heading>

        {event.image && (
          <Image
            src={event.image}
            alt={event.title}
            maxH="300px"
            objectFit="cover"
            borderRadius="md"
            mb="4"
          />
        )}

        <Text fontSize="lg" mb="2">
          {event.description}
        </Text>

        <Text fontSize="sm" color="gray.400">
          Start: {new Date(event.startTime).toLocaleString()}
        </Text>
        <Text fontSize="sm" color="gray.400" mb="2">
          End: {new Date(event.endTime).toLocaleString()}
        </Text>

        <Text fontSize="sm" color="gray.400" mb="2">
          Categories: {event.categories?.join(", ") || "None"}
        </Text>

        {creator && (
          <Box mt="4">
            <Text fontWeight="bold">Created by:</Text>
            <Box display="flex" alignItems="center" gap="2" mt="1">
              {creator.image && (
                <Image
                  src={creator.image}
                  alt={creator.name}
                  boxSize="40px"
                  borderRadius="full"
                />
              )}
              <Text>{creator.name}</Text>
            </Box>
          </Box>
        )}

        <Button mt="6" colorScheme="blue" onClick={onEditOpen}>
          Edit
        </Button>

        {/* Delete button opent confirm modal */}
        <Button mt="6" ml="4" colorScheme="red" onClick={onDeleteOpen}>
          Delete
        </Button>

        {/* Edit Modal */}
        <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form id="edit-event-form" onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>Title</FormLabel>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Image URL</FormLabel>
                    <Input
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Start Time</FormLabel>
                    <Input
                      name="startTime"
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>End Time</FormLabel>
                    <Input
                      name="endTime"
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Categories (comma separated)</FormLabel>
                    <Input
                      name="categories"
                      value={formData.categories}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Stack>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onEditClose}>
                Cancel
              </Button>
              <Button type="submit" form="edit-event-form" colorScheme="blue">
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Confirm Delete Modal */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Delete</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Are you sure you want to delete this event?</Text>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};

export default EventPage;
