import { useState, useEffect, useMemo } from "react";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  WeekView,
  MonthView,
  DayView,
  EditRecurrenceMenu,
  ConfirmationDialog,
  Toolbar,
  ViewSwitcher,
  DateNavigator,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import { db } from "../data/firebase";
import {collection,addDoc,updateDoc,deleteDoc,onSnapshot,doc,} from "firebase/firestore";


const SchedulerComponent = () => {
  const [appointments, setAppointments] = useState([]);
  
  const DataContext = collection(db, "appointments");

  const convertTimestampToDate = (timestamp) => {
	return new Date(timestamp.seconds * 1000);
  };

  const fetchAppointments = () => {
    const unsubscribe = onSnapshot(
      DataContext,
      (snapshot) => {
		const fetchedAppointments = snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
			  id: doc.id,
			  title: data.title,
			  startDate: convertTimestampToDate(data.startDate),
			  endDate: convertTimestampToDate(data.endDate),
			  allDay: data.allDay || false,
			};
		  });
        setAppointments(fetchedAppointments);
      },
      (error) => {
        console.error("Error fetching appointments: ", error);
      }
    );
    return unsubscribe;
  };
  useEffect(() => {
    const unsubscribe = fetchAppointments();
    return () => unsubscribe();
  }, []); 

  const memoizedAppointments = useMemo(() => appointments, [appointments]);

  const addAppointment = async (appointment) => {
    try {
      await addDoc(DataContext, appointment);
    } catch (error) {
      console.error("Error adding appointment: ", error);
    }
  };
  const updateAppointment = async ({ id, changes }) => {
    try {
      const appointmentDocRef = doc(db, "appointments", id);
      await updateDoc(appointmentDocRef, changes);
    } catch (error) {
      console.error("Error updating appointment: ", error);
    }
  };
  const deleteAppointment = async (id) => {
    try {
      const appointmentDocRef = doc(db, "appointments", id);
      await deleteDoc(appointmentDocRef);
    } catch (error) {
      console.error("Error deleting appointment: ", error);
    }
  };

  const EditingStateChanges = async ({ added, changed, deleted }) => {
    try {
      if (added) {
        await addAppointment(added);
        alert("Appointment added successfully");
      }
      if (changed) {
        const id = Object.keys(changed)[0];
        await updateAppointment({ id, changes: changed[id] });
        alert("Appointment updated successfully");
      }
      if (deleted !== undefined) {
        await deleteAppointment(deleted);
        alert("Appointment deleted successfully");
      }
    } catch (error) {
      console.error("Error committing changes: ", error);
      alert("An error occurred");
    }
  };

  return (
    <Scheduler data={memoizedAppointments} locale="pl-PL">
      <ViewState />
      <EditingState onCommitChanges={EditingStateChanges} />

      <MonthView startDayHour={6} endDayHour={18} />
      <DayView startDayHour={6} endDayHour={18} />
      <WeekView startDayHour={6} endDayHour={18} />

      <Toolbar />
      <DateNavigator />
      <TodayButton />
      <ViewSwitcher />

      <EditRecurrenceMenu />
      <ConfirmationDialog />
      <Appointments />
      <AppointmentTooltip />
      <AppointmentForm />
    </Scheduler>
  );
};

export default SchedulerComponent;
