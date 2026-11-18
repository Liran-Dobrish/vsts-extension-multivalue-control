import * as SDK from "azure-devops-extension-sdk";
import { WorkItemTrackingServiceIds, IWorkItemFormService, IWorkItemLoadedArgs, IWorkItemFieldChangedArgs } from "azure-devops-extension-api/WorkItemTracking";
import { MultiValueEvents } from "./MultiValueEvents";

const provider = () => {
    let control: MultiValueEvents;

    const ensureControl = () => {
        if (!control) {
            control = new MultiValueEvents();
        }
        control.refresh();
    };

    return {
        onLoaded: (args: IWorkItemLoadedArgs) => {
            ensureControl();
        },
        onFieldChanged: (args: IWorkItemFieldChangedArgs) => {
            if (control && args.changedFields[control.fieldName] !== undefined &&
                args.changedFields[control.fieldName] !== null
            ) {
                control.refresh();
            }
        },
    };
};

// Initialize the SDK and register the provider
SDK.init().then(() => {
    // save on ctr + s
    window.addEventListener("keydown", async (event: KeyboardEvent) => {
        if (event.ctrlKey || event.metaKey) {
            if (event.key === "s" || event.key === "S") {
                event.preventDefault();
                const service = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
                service.beginSaveWorkItem(() => {}, () => {});
            }
        }
    });

    SDK.register(SDK.getContributionId(), provider);
});
