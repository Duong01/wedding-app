import { service } from "@/plugins/axios";

export function getWedding() {

    return service.get("/wedding");

}

export function getGallery() {

    return service.get("/gallery");

}

export function getStory() {

    return service.get("/story");

}

export function getEvents() {

    return service.get("/events");

}

export function getBanks() {

    return service.get("/banks");

}

export function getGuestBook() {

    return service.get("/guestbook");

}