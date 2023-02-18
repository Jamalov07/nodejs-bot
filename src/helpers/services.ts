import { Service_type } from "./../models/service_type.model";

export async function services() {
  const services = await Service_type.findAll();
  let serviceNames = [];
  for (let i = 0; i < services.length; i++) {
    serviceNames.push(services[i].name);
  }
  return  serviceNames;
}
