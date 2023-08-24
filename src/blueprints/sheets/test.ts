import { Flatfile } from "@flatfile/api";

export const testSheet: Flatfile.SheetConfig = {
    "name": "Test",
    "slug": "test",
    "fields": [
        {
            "key": "worker_id",
            "label": "Worker ID",
            "type": "string",
            "constraints": [
                {
                    "type": "required"
                }
            ]
        },
        {
            "key": "pre-hire_id",
            "label": "Pre-Hire ID",
            "type": "number",
            "constraints": [
                {
                    "type": "required"
                }
            ]
        },
        {
            "key": "position_id",
            "label": "Position ID",
            "type": "number",
            "constraints": [
                {
                    "type": "required"
                }
            ]
        },
        {
            "key": "manager_position_id",
            "label": "Manager Position ID",
            "type": "number",
            "constraints": [
                {
                    "type": "required"
                }
            ]
        },
        {
            "key": "manager_organization_name",
            "label": "Manager Organization Name",
            "type": "string",
            "constraints": [
                {
                    "type": "required"
                }
            ]
        },
        {
            "key": "employee_type",
            "label": "Employee Type",
            "type": "string",
            "constraints": [
                {
                    "type": "required"
                }
            ]
        },
        {
            "key": "hire_reason",
            "label": "Hire Reason",
            "type": "string",
            "constraints": [
                {
                    "type": "required"
                }
            ]
        },
        {
            "key": "hire_date",
            "label": "Hire Date",
            "type": "date",
            "constraints": [
                {
                    "type": "required"
                }
            ]
        },
        {
            "key": "first_day_of_work",
            "label": "First Day of Work",
            "type": "date"
        },
        {
            "key": "active",
            "label": "Active",
            "type": "boolean",
            "constraints": [
                {
                    "type": "required"
                }
            ]
        }
    ]
};
