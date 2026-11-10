# Testing – Metro Control Room Operator Console

## 1. Introduction

Testing was performed on the Metro Control Room Operator Console to verify the functionality, usability and reliability of the web-based prototype.

The objective was to ensure that the dashboard sections and interactive features work as expected.

## 2. Testing Objectives

- Verify that all dashboard sections are displayed correctly.
- Check train monitoring information.
- Test fault acknowledgement and resolution.
- Verify passenger incident reporting.
- Test simulated emergency assistance dispatch.
- Check incident status updates.
- Verify shift management information.
- Identify and correct interface errors.

## 3. Testing Environment

| Component | Details |
|---|---|
| Operating System | Windows |
| Development Tool | Visual Studio Code |
| Browser | Google Chrome |
| Technologies | HTML, CSS, JavaScript |
| Testing Method | Manual Functional Testing |

## 4. Functional Test Cases

| Test ID | Test Scenario | Expected Result |
|---|---|---|
| TC01 | Open the dashboard | Dashboard loads correctly |
| TC02 | View Overview | Overview information is displayed |
| TC03 | Open Train Monitoring | Train records are displayed |
| TC04 | Check train status | Correct train status is shown |
| TC05 | View Fault Alerts | Active alerts are displayed |
| TC06 | Acknowledge an alert | Alert acknowledgement is updated |
| TC07 | Resolve an alert | Alert status changes to resolved |
| TC08 | Open Passenger Incidents | Incident records are displayed |
| TC09 | Report a new incident | New incident is added |
| TC10 | Select assistance type | Selected assistance is displayed |
| TC11 | Dispatch assistance | Simulated dispatch is recorded |
| TC12 | Update incident status | Incident progress is updated |
| TC13 | Resolve an incident | Incident is marked resolved |
| TC14 | Open Shift Management | Shift details are displayed |
| TC15 | Check handover checklist | Checklist interactions work |

## 5. Testing Results

The developer reports that the listed functional checks were completed successfully in the local browser.

| Test Area | Result |
|---|---|
| Overview Dashboard | Pass |
| Train Monitoring | Pass |
| Fault Alerts | Pass |
| Passenger Incident Management | Pass |
| Simulated Assistance Dispatch | Pass |
| Shift Management | Pass |
| Dashboard Navigation | Pass |

## 6. Issues Identified and Improvements

During development and testing, the following improvements were made:

- Corrected a JavaScript initialization issue that prevented register data from appearing.
- Improved dashboard section visibility.
- Ensured train, alert and incident records render correctly.
- Added passenger assistance selection and simulated dispatch.
- Improved incident status tracking.
- Verified the interaction between dashboard sections.

## 7. Usability and Accessibility Review

The following aspects should be reviewed:

- Clear labels and navigation.
- Readable text and sufficient colour contrast.
- Visible status indicators.
- Consistent interface components.
- Keyboard accessibility.
- Appropriate feedback after user actions.
- Error handling and empty states.

A complete WCAG 2.2 AA audit and testing with external users remain additional validation activities.

## 8. Limitations

- Train records use simulated data.
- Fault alerts are demonstration records.
- Emergency assistance dispatch does not contact actual emergency services.
- The prototype is not connected to real metro infrastructure.
- Testing was performed on the local development environment.

## 9. Conclusion

Functional testing helped verify the main features of the Metro Control Room Operator Console. The prototype successfully demonstrates train monitoring, fault management, passenger incident coordination and shift management workflows.

Further usability testing with actual target users and accessibility validation can help improve the design.
