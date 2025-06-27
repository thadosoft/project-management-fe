import React from "react";
import { Tree, TreeNode } from "react-organizational-chart";

/**
 * Reusable data model for a node in the organisation tree
 */
export interface OrgNode {
  id: string;
  title: string; // e.g. "Team IT"
  subtitle?: string; // e.g. "Team leader – Mr. Dũng"
  color?: string; // Tailwind bg‑color utility without the "bg-" prefix, e.g. "green-700"
  children?: OrgNode[];
}

/**
 * Internal helper that renders a single OrgNode as a <TreeNode /> with Tailwind styling
 */
const RenderNode: React.FC<{ node: OrgNode }> = ({ node }) => {
  const bgColor = node.color ? `bg-${node.color}` : "bg-sky-600";
  return (
    <TreeNode
      label={
        <div
          className={`inline-block px-2 py-1 rounded shadow text-white text-center text-sm ${bgColor}`}
          style={{
            minWidth: "100px", 
            maxWidth: "150px",
            fontSize: "12px", 
            whiteSpace: "normal", 
            wordWrap: "break-word",
          }}
        >
          <div className="font-semibold">{node.title}</div>
          {node.subtitle && (
            <div className="text-[12px] leading-tight mt-1">
              {node.subtitle}
            </div>
          )}
        </div>
      }
    >
      {node.children?.map((child) => (
        <RenderNode key={child.id} node={child} />
      ))}
    </TreeNode>
  );
};


/**
 * <OrgChart data={tree} /> – renders the whole organisation chart.
 *
 * Tip: wrap the component with a container that allows horizontal scrolling
 * (e.g. <div className="overflow-x-auto">) because large trees can be wider
 * than the viewport.
 */
export const OrgChart: React.FC<{ data: OrgNode }> = ({ data }) => {
  return (
    <div
      className="overflow-auto"
      style={{
        transformOrigin: "top center",
        width: "fit-content",
      }}
    >
      <Tree
        lineWidth="2px"
        lineColor="#9CA3AF"
        lineBorderRadius="8px"
        label={
          <div
            className={`inline-block px-4 py-2 rounded shadow text-white text-center bg-sky-600`}
          >
            <div className="font-semibold whitespace-nowrap">{data.title}</div>
            {data.subtitle && (
              <div className="text-[10px] leading-tight mt-1 whitespace-nowrap">
                {data.subtitle}
              </div>
            )}
          </div>
        }
      >
        {data.children?.map((child) => (
          <RenderNode key={child.id} node={child} />
        ))}
      </Tree>
    </div>
  );
};


/**
 * -------------------------------------------------------------------------
 * ⚡ Example usage – you can delete this part in production
 * -------------------------------------------------------------------------
 */

